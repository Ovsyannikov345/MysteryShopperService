using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MysteryShopper.DAL.Migrations
{
    /// <inheritdoc />
    public partial class RemoveCompanyFromReportCorrection : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ReportCorrections_Companies_CompanyId",
                table: "ReportCorrections");

            migrationBuilder.AlterColumn<Guid>(
                name: "CompanyId",
                table: "ReportCorrections",
                type: "uuid",
                nullable: true,
                oldClrType: typeof(Guid),
                oldType: "uuid");

            migrationBuilder.AddForeignKey(
                name: "FK_ReportCorrections_Companies_CompanyId",
                table: "ReportCorrections",
                column: "CompanyId",
                principalTable: "Companies",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ReportCorrections_Companies_CompanyId",
                table: "ReportCorrections");

            migrationBuilder.AlterColumn<Guid>(
                name: "CompanyId",
                table: "ReportCorrections",
                type: "uuid",
                nullable: false,
                defaultValue: Guid.Empty,
                oldClrType: typeof(Guid),
                oldType: "uuid",
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_ReportCorrections_Companies_CompanyId",
                table: "ReportCorrections",
                column: "CompanyId",
                principalTable: "Companies",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
