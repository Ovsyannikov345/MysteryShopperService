using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MysteryShopper.DAL.Migrations
{
    /// <inheritdoc />
    public partial class AddOrderTagsRelationToOrders : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_OrderTag_Orders_OrderId",
                table: "OrderTag");

            migrationBuilder.DropIndex(
                name: "IX_OrderTag_OrderId",
                table: "OrderTag");

            migrationBuilder.DropColumn(
                name: "OrderId",
                table: "OrderTag");

            migrationBuilder.CreateTable(
                name: "OrderOrderTag",
                columns: table => new
                {
                    OrdersId = table.Column<Guid>(type: "uuid", nullable: false),
                    TagsId = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_OrderOrderTag", x => new { x.OrdersId, x.TagsId });
                    table.ForeignKey(
                        name: "FK_OrderOrderTag_OrderTag_TagsId",
                        column: x => x.TagsId,
                        principalTable: "OrderTag",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_OrderOrderTag_Orders_OrdersId",
                        column: x => x.OrdersId,
                        principalTable: "Orders",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_OrderOrderTag_TagsId",
                table: "OrderOrderTag",
                column: "TagsId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "OrderOrderTag");

            migrationBuilder.AddColumn<Guid>(
                name: "OrderId",
                table: "OrderTag",
                type: "uuid",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_OrderTag_OrderId",
                table: "OrderTag",
                column: "OrderId");

            migrationBuilder.AddForeignKey(
                name: "FK_OrderTag_Orders_OrderId",
                table: "OrderTag",
                column: "OrderId",
                principalTable: "Orders",
                principalColumn: "Id");
        }
    }
}
