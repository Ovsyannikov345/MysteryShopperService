﻿using MysteryShopper.DAL.Entities.Models;

namespace MysteryShopper.BLL.Dto
{
    public class ReportModel
    {
        public Guid Id { get; set; }

        public required string Title { get; set; }

        public required string Description { get; set; }

        public short Grade { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public Guid UserId { get; set; }

        public required User User { get; set; }

        public Guid OrderId { get; set; }

        public required Order Order { get; set; }

        public ReportCorrection? ReportCorrection { get; set; }
    }
}