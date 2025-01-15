using MysteryShopper.BLL.Services.IServices;
using MysteryShopper.BLL.Utilities.Mistral.Services.IServices;
using MysteryShopper.DAL.Entities.Models;
using MysteryShopper.DAL.Repositories.IRepositories;
namespace MysteryShopper.BLL.Services;

public class CategorizationService(
    ICategoryRepository categoryRepository,
    IOrderTagRepository orderTagRepository,
    IMistralService mistralService) : ICategorizationService
{
    public async Task CategorizeOrder(Order order, CancellationToken cancellationToken = default)
    {
        if (order.Description is null)
        {
            return;
        }

        var categories = await categoryRepository.GetCategoriesWithTags(cancellationToken);

        foreach (var category in categories)
        {
            if (category.Name != "Business Type")
            {
                continue;
            }

            var tagData = await mistralService.GetOrderTagsAsync(
                order.Description, category.Name, category.Tags.Select(t => t.Text), cancellationToken);

            foreach (var tagText in tagData.Tags)
            {
                var tag = await orderTagRepository.GetByItemAsync(t => t.Text == tagText, cancellationToken);

                if (tag is not null)
                {
                    order.Tags.Add(tag);
                    continue;
                }

                tagData.NewTags.Add(tagText);
            }

            foreach (var tagText in tagData.NewTags)
            {
                var existingTag = await orderTagRepository.GetByItemAsync(t => t.Text == tagText, cancellationToken);

                if (existingTag is not null)
                {
                    order.Tags.Add(existingTag);
                    continue;
                }

                var tag = await orderTagRepository.AddAsync(new OrderTag
                {
                    Text = tagText,
                    Category = category,
                    CategoryId = category.Id
                }, cancellationToken);

                order.Tags.Add(tag);
            }
        }
    }
}
