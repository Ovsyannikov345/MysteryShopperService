namespace MysteryShopper.DAL.BlobStorages.Entities;

public class BlobObject
{
    public required string Name { get; set; }

    public required string ContentType { get; set; }

    public required Stream Stream { get; set; }
}
