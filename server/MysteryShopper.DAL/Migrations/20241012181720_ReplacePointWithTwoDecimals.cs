using Microsoft.EntityFrameworkCore.Migrations;
using NetTopologySuite.Geometries;

#nullable disable

namespace MysteryShopper.DAL.Migrations
{
    /// <inheritdoc />
    public partial class ReplacePointWithTwoDecimals : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Point",
                table: "Orders");

            migrationBuilder.AddColumn<double>(
                name: "Lat",
                table: "Orders",
                type: "double precision",
                nullable: true);

            migrationBuilder.AddColumn<double>(
                name: "Lng",
                table: "Orders",
                type: "double precision",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Lat",
                table: "Orders");

            migrationBuilder.DropColumn(
                name: "Lng",
                table: "Orders");

            migrationBuilder.AddColumn<Point>(
                name: "Point",
                table: "Orders",
                type: "geometry",
                nullable: true);
        }
    }
}
