using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MysteryShopper.DAL.Migrations
{
    /// <inheritdoc />
    public partial class ConnectCompanyAndCompanyReviews : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "CompanyId",
                table: "CompanyReviews",
                type: "uuid",
                nullable: false,
                defaultValue: Guid.Empty);

            migrationBuilder.CreateIndex(
                name: "IX_CompanyReviews_CompanyId",
                table: "CompanyReviews",
                column: "CompanyId");

            migrationBuilder.AddForeignKey(
                name: "FK_CompanyReviews_Companies_CompanyId",
                table: "CompanyReviews",
                column: "CompanyId",
                principalTable: "Companies",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_CompanyReviews_Companies_CompanyId",
                table: "CompanyReviews");

            migrationBuilder.DropIndex(
                name: "IX_CompanyReviews_CompanyId",
                table: "CompanyReviews");

            migrationBuilder.DropColumn(
                name: "CompanyId",
                table: "CompanyReviews");
        }
    }
}
