using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MysteryShopper.DAL.Migrations
{
    /// <inheritdoc />
    public partial class Remove_Patronymic : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Patronymic",
                table: "ContactPeople");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Patronymic",
                table: "ContactPeople",
                type: "character varying(50)",
                maxLength: 50,
                nullable: true);
        }
    }
}
