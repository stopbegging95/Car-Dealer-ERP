"use client";

import React, { useState } from "react";
import {
  FiCalendar,
  FiMapPin,
  FiPhone,
  FiPlus,
  FiClock,
  FiCheckCircle,
} from "react-icons/fi";
import { Button, Badge, Modal, Input, Dropdown, MasterDropdown, Table, Card } from "@/components/ui";
import { VEHICLES } from "@/data/vehicles";

export interface TestDriveItem {
  id: string;
  vehicle: string;
  stockId: string;
  date: string;
  showroom: string;
  liaison: string;
  phone: string;
  status: string;
}

export interface TestDrivesTabProps {
  testDriveBookings: TestDriveItem[];
}

export const TestDrivesTab: React.FC<TestDrivesTabProps> = ({ testDriveBookings: initialBookings }) => {
  const [bookings, setBookings] = useState<TestDriveItem[]>(initialBookings);
  const [isBookModalOpen, setIsBookModalOpen] = useState(false);
  const [isRescheduleModalOpen, setIsRescheduleModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<TestDriveItem | null>(null);

  // Form states for booking
  const [selectedStockId, setSelectedStockId] = useState<string>("STK-2026-001");
  const [bookingDate, setBookingDate] = useState<string>("2026-11-28");
  const [bookingTime, setBookingTime] = useState<string>("14:00");
  const [selectedHub, setSelectedHub] = useState<string>("Victoria Island Flagship Showroom, Lagos");
  const [licenseNumber, setLicenseNumber] = useState<string>("DL-882910-NG");
  const [rescheduleDate, setRescheduleDate] = useState<string>("2026-11-30");
  const [rescheduleTime, setRescheduleTime] = useState<string>("15:30");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleCreateBooking = (e: React.FormEvent) => {
    e.preventDefault();
    const vehicleObj = VEHICLES.find((v) => v.stockId === selectedStockId) || VEHICLES[0];
    const newId = `TD-${Math.floor(100 + Math.random() * 900)}`;
    const formattedDate = new Date(`${bookingDate}T${bookingTime}`).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

    const newBooking: TestDriveItem = {
      id: newId,
      vehicle: `${vehicleObj.year} ${vehicleObj.make} ${vehicleObj.model}`,
      stockId: vehicleObj.stockId,
      date: `${formattedDate} at ${bookingTime}`,
      showroom: selectedHub,
      liaison: "Executive Relations Emeka O.",
      phone: "+234 (0) 800 123 4567",
      status: "Confirmed",
    };

    setBookings([newBooking, ...bookings]);
    setIsBookModalOpen(false);
    showToast(`VIP Test Drive scheduled for ${newBooking.vehicle} at ${selectedHub}!`);
  };

  const handleRescheduleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBooking) return;

    const formattedDate = new Date(`${rescheduleDate}T${rescheduleTime}`).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

    setBookings(
      bookings.map((b) =>
        b.id === selectedBooking.id
          ? {
              ...b,
              date: `${formattedDate} at ${rescheduleTime}`,
              status: "Rescheduled / Confirmed",
            }
          : b
      )
    );
    setIsRescheduleModalOpen(false);
    showToast(`Test drive ${selectedBooking.id} successfully rescheduled to ${formattedDate} at ${rescheduleTime}.`);
  };

  return (
    <div className="space-y-4">
      {toastMessage && (
        <div className="flex items-center gap-2 bg-[#EFF6FF] border border-[#2563EB] text-[#1E40AF] px-4 py-2.5 rounded-xl text-xs font-semibold shadow-xs animate-in fade-in duration-200">
          <FiCheckCircle className="w-4 h-4 text-[#2563EB] shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      <Card className="shadow-xs p-4 sm:p-5">
        <div className="flex sm:flex-row flex-col justify-between sm:items-center gap-3">
          <div>
            <h3 className="font-bold text-[#0F172A] text-base uppercase tracking-tight">
              VIP Test Drive Appointments ({bookings.length})
            </h3>
            <p className="text-[#64748B] text-xs">
              Scheduled private showroom viewings with assigned client relations liaisons.
            </p>
          </div>

          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsBookModalOpen(true)}
            leftIcon={<FiPlus className="w-3.5 h-3.5" />}
          >
            + Schedule VIP Test Drive
          </Button>
        </div>
      </Card>

      <Table
        data={bookings}
        keyExtractor={(item) => item.id}
        pageSize={15}
        showSerialNumber={true}
        columns={[
          {
            key: "id",
            header: "Ref ID",
            sortable: true,
            render: (td) => <span className="font-mono font-bold text-[#2563EB] text-xs">{td.id}</span>,
          },
          {
            key: "vehicle",
            header: "Vehicle & Stock ID",
            sortable: true,
            render: (td) => (
              <div>
                <span className="font-bold text-[#0F172A] text-xs">{td.vehicle}</span>
                <span className="block font-mono text-[#64748B] text-[10px]">{td.stockId}</span>
              </div>
            ),
          },
          {
            key: "date",
            header: "Scheduled Date & Time",
            sortable: true,
            render: (td) => (
              <span className="flex items-center gap-1 font-semibold text-[#0F172A] text-xs">
                <FiCalendar className="w-3.5 h-3.5 text-[#2563EB]" />
                {td.date}
              </span>
            ),
          },
          {
            key: "showroom",
            header: "Showroom Hub",
            render: (td) => (
              <span className="flex items-center gap-1 text-[#475569] text-xs">
                <FiMapPin className="w-3.5 h-3.5 text-[#2563EB]" />
                {td.showroom}
              </span>
            ),
          },
          {
            key: "liaison",
            header: "Assigned Liaison",
            render: (td) => (
              <div>
                <span className="font-medium text-[#0F172A] text-xs">{td.liaison}</span>
                <span className="block text-[#64748B] text-[10px]">{td.phone}</span>
              </div>
            ),
          },
          {
            key: "status",
            header: "Status",
            render: (td) => <Badge variant="gold" size="sm">{td.status}</Badge>,
          },
          {
            key: "actions",
            header: "Action",
            render: (td) => (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSelectedBooking(td);
                  setIsRescheduleModalOpen(true);
                }}
                leftIcon={<FiClock className="w-3.5 h-3.5 text-[#2563EB]" />}
              >
                Reschedule
              </Button>
            ),
          },
        ]}
      />

      {/* Book New Test Drive Modal */}
      <Modal
        isOpen={isBookModalOpen}
        onClose={() => setIsBookModalOpen(false)}
        size="lg"
        title="Schedule Private VIP Test Drive"
        description="Book a dedicated viewing and test drive accompanied by a senior dealership executive."
      >
        <form onSubmit={handleCreateBooking} className="space-y-4">
          <Dropdown
            label="Select Showroom Vehicle"
            value={selectedStockId}
            onChange={(val) => setSelectedStockId(String(val))}
            options={VEHICLES.map((v) => ({
              label: `${v.year} ${v.make} ${v.model} (${v.stockId}) - ₦${v.priceNGN.toLocaleString()}`,
              value: v.stockId,
            }))}
          />

          <div className="gap-3 grid grid-cols-1 sm:grid-cols-2">
            <Input
              label="Preferred Date"
              type="date"
              value={bookingDate}
              onChange={(e) => setBookingDate(e.target.value)}
              required
            />
            <Input
              label="Preferred Time"
              type="time"
              value={bookingTime}
              onChange={(e) => setBookingTime(e.target.value)}
              required
            />
          </div>

          <MasterDropdown
            category="hubs"
            label="Showroom Location Hub"
            value={selectedHub}
            onChange={(val) => setSelectedHub(String(val))}
            required
          />

          <Input
            label="Driver's License / Diplomatic ID Number"
            value={licenseNumber}
            onChange={(e) => setLicenseNumber(e.target.value)}
            required
            helperText="Required for test drive insurance validation and vehicle gate clearance."
          />

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" size="sm" type="button" onClick={() => setIsBookModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit">
              Confirm VIP Booking
            </Button>
          </div>
        </form>
      </Modal>

      {/* Reschedule Modal */}
      <Modal
        isOpen={isRescheduleModalOpen}
        onClose={() => setIsRescheduleModalOpen(false)}
        size="md"
        title={`Reschedule Test Drive: ${selectedBooking?.id}`}
        description={`Modify viewing appointment for ${selectedBooking?.vehicle}.`}
      >
        <form onSubmit={handleRescheduleSubmit} className="space-y-4">
          <Input
            label="New Date"
            type="date"
            value={rescheduleDate}
            onChange={(e) => setRescheduleDate(e.target.value)}
            required
          />
          <Input
            label="New Time"
            type="time"
            value={rescheduleTime}
            onChange={(e) => setRescheduleTime(e.target.value)}
            required
          />

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" size="sm" type="button" onClick={() => setIsRescheduleModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit">
              Update Appointment
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
