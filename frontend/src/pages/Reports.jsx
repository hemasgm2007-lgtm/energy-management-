import { useState } from "react";
import {
  FileText,
  Download,
  FileDown,
  Zap,
  IndianRupee,
  Factory,
  AlertTriangle,
  TrendingUp,
  CalendarDays,
} from "lucide-react";

import "../styles/Reports.css";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

function Reports() {
  const [reportType, setReportType] = useState("Energy Consumption");
  const [period, setPeriod] = useState("Last 7 Days");

  // =========================================================
  // SIMULATED REPORT DATA
  // =========================================================

  const reportData = {
    totalEnergy: 343.7,
    totalPower: 42.9,
    estimatedCost: 2921.45,
    averageDailyEnergy: 49.1,
    energySaving: 12.5,
    efficiency: 18.7,
    totalAlerts: 5,
    activeAlerts: 2,

    machines: [
      {
        machine: "CNC Machine 01",
        energy: 124.5,
        power: 15.5,
        percentage: 36.2,
        status: "High",
      },
      {
        machine: "Compressor 01",
        energy: 102.4,
        power: 12.8,
        percentage: 29.8,
        status: "High",
      },
      {
        machine: "Injection Molding 01",
        energy: 65.6,
        power: 8.2,
        percentage: 19.1,
        status: "Normal",
      },
      {
        machine: "Welding Unit 01",
        energy: 51.2,
        power: 6.4,
        percentage: 14.9,
        status: "Normal",
      },
    ],

    daily: [
      {
        date: "02 Sep 2026",
        energy: 45.2,
        power: 38.5,
        cost: 384.2,
      },
      {
        date: "03 Sep 2026",
        energy: 48.6,
        power: 40.2,
        cost: 413.1,
      },
      {
        date: "04 Sep 2026",
        energy: 51.4,
        power: 43.1,
        cost: 436.9,
      },
      {
        date: "05 Sep 2026",
        energy: 47.8,
        power: 41.6,
        cost: 406.3,
      },
      {
        date: "06 Sep 2026",
        energy: 52.1,
        power: 44.5,
        cost: 442.9,
      },
      {
        date: "07 Sep 2026",
        energy: 49.5,
        power: 42.7,
        cost: 420.75,
      },
      {
        date: "08 Sep 2026",
        energy: 49.1,
        power: 42.9,
        cost: 417.25,
      },
    ],
  };

  // =========================================================
  // CSV DOWNLOAD
  // =========================================================

  const downloadCSV = () => {
    const rows = [
      [
        "Machine",
        "Energy Consumption (kWh)",
        "Power (kW)",
        "Consumption (%)",
        "Status",
      ],
      ...reportData.machines.map((machine) => [
        machine.machine,
        machine.energy,
        machine.power,
        machine.percentage,
        machine.status,
      ]),
    ];

    const csvContent = rows
      .map((row) =>
        row
          .map((value) => `"${String(value).replace(/"/g, '""')}"`)
          .join(",")
      )
      .join("\n");

    const blob = new Blob([csvContent], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;
    link.download = "smart-energy-report.csv";

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  };

  // =========================================================
  // PDF DOWNLOAD
  // =========================================================

  const downloadPDF = () => {
    const doc = new jsPDF();

    // TITLE
    doc.setFontSize(20);
    doc.setTextColor(9, 36, 72);
    doc.text("Smart Energy Monitoring Report", 14, 20);

    // SUBTITLE
    doc.setFontSize(10);
    doc.setTextColor(100, 120, 145);

    doc.text(
      `${reportType} | ${period}`,
      14,
      28
    );

    doc.text(
      "Generated: 08 Sep 2026",
      14,
      34
    );

    // SUMMARY
    doc.setFontSize(13);
    doc.setTextColor(9, 36, 72);
    doc.text("Energy Summary", 14, 46);

    autoTable(doc, {
      startY: 51,

      head: [
        [
          "Total Energy",
          "Current Power",
          "Estimated Cost",
          "Energy Saving",
        ],
      ],

      body: [
        [
          `${reportData.totalEnergy} kWh`,
          `${reportData.totalPower} kW`,
          `Rs. ${reportData.estimatedCost.toFixed(2)}`,
          `${reportData.energySaving}%`,
        ],
      ],

      theme: "grid",

      headStyles: {
        fillColor: [25, 118, 255],
      },

      styles: {
        fontSize: 9,
        cellPadding: 4,
      },
    });

    // MACHINE TABLE
    const machineStartY =
      doc.lastAutoTable.finalY + 12;

    doc.setFontSize(13);
    doc.setTextColor(9, 36, 72);

    doc.text(
      "Machine-wise Energy Consumption",
      14,
      machineStartY
    );

    autoTable(doc, {
      startY: machineStartY + 5,

      head: [
        [
          "Machine",
          "Energy (kWh)",
          "Power (kW)",
          "Share",
          "Status",
        ],
      ],

      body: reportData.machines.map((machine) => [
        machine.machine,
        machine.energy,
        machine.power,
        `${machine.percentage}%`,
        machine.status,
      ]),

      theme: "striped",

      headStyles: {
        fillColor: [25, 118, 255],
      },

      styles: {
        fontSize: 9,
        cellPadding: 4,
      },
    });

    // DAILY TABLE
    const dailyStartY =
      doc.lastAutoTable.finalY + 12;

    doc.setFontSize(13);
    doc.setTextColor(9, 36, 72);

    doc.text(
      "Daily Energy Consumption",
      14,
      dailyStartY
    );

    autoTable(doc, {
      startY: dailyStartY + 5,

      head: [
        [
          "Date",
          "Energy (kWh)",
          "Power (kW)",
          "Cost (Rs.)",
        ],
      ],

      body: reportData.daily.map((day) => [
        day.date,
        day.energy,
        day.power,
        day.cost.toFixed(2),
      ]),

      theme: "grid",

      headStyles: {
        fillColor: [16, 185, 129],
      },

      styles: {
        fontSize: 9,
        cellPadding: 4,
      },
    });

    // FOOTER
    const pageHeight =
      doc.internal.pageSize.height;

    doc.setFontSize(9);
    doc.setTextColor(120, 135, 155);

    doc.text(
      "Smart Energy Monitoring System | Simulated Data",
      14,
      pageHeight - 10
    );

    doc.save("smart-energy-report.pdf");
  };

  return (
    <div className="reports-page">

      {/* =====================================================
          HEADER
          ===================================================== */}

      <div className="reports-header">

        <div className="reports-title-section">

          <div className="reports-title-icon">
            <FileText size={27} />
          </div>

          <div>
            <h1>Reports</h1>

            <p>
              Analyze energy consumption, costs,
              machine performance and system efficiency
            </p>
          </div>

        </div>

        {/* DOWNLOAD BUTTONS */}

        <div className="reports-actions">

          <button
            className="report-download csv"
            onClick={downloadCSV}
          >
            <FileDown size={16} />
            Download CSV
          </button>

          <button
            className="report-download pdf"
            onClick={downloadPDF}
          >
            <Download size={16} />
            Download PDF
          </button>

        </div>

      </div>


      {/* =====================================================
          FILTER BAR
          ===================================================== */}

      <div className="reports-filter">

        <div className="filter-item">

          <CalendarDays size={16} />

          <label>Report Type</label>

          <select
            value={reportType}
            onChange={(e) =>
              setReportType(e.target.value)
            }
          >
            <option>Energy Consumption</option>
            <option>Machine Performance</option>
            <option>Cost Analysis</option>
            <option>Energy Efficiency</option>
          </select>

        </div>


        <div className="filter-item">

          <CalendarDays size={16} />

          <label>Period</label>

          <select
            value={period}
            onChange={(e) =>
              setPeriod(e.target.value)
            }
          >
            <option>Today</option>
            <option>Last 7 Days</option>
            <option>Last 30 Days</option>
            <option>This Month</option>
          </select>

        </div>

      </div>


      {/* =====================================================
          SUMMARY CARDS
          ===================================================== */}

      <div className="report-stats">

        <div className="report-stat-card">

          <div className="report-stat-icon blue">
            <Zap size={21} />
          </div>

          <div>
            <span>Total Energy</span>
            <strong>
              {reportData.totalEnergy} kWh
            </strong>

            <small>
              Last 7 days
            </small>
          </div>

        </div>


        <div className="report-stat-card">

          <div className="report-stat-icon orange">
            <TrendingUp size={21} />
          </div>

          <div>
            <span>Average Daily Energy</span>

            <strong>
              {reportData.averageDailyEnergy} kWh
            </strong>

            <small>
              Daily average
            </small>
          </div>

        </div>


        <div className="report-stat-card">

          <div className="report-stat-icon green">
            <IndianRupee size={21} />
          </div>

          <div>
            <span>Estimated Cost</span>

            <strong>
              ₹{reportData.estimatedCost.toLocaleString("en-IN")}
            </strong>

            <small>
              @ ₹8.50 / kWh
            </small>
          </div>

        </div>


        <div className="report-stat-card">

          <div className="report-stat-icon purple">
            <TrendingUp size={21} />
          </div>

          <div>
            <span>Efficiency Improvement</span>

            <strong>
              {reportData.efficiency}%
            </strong>

            <small>
              Compared with baseline
            </small>
          </div>

        </div>

      </div>


      {/* =====================================================
          MACHINE CONSUMPTION
          ===================================================== */}

      <div className="report-panel">

        <div className="report-panel-header">

          <div>
            <h2>Machine-wise Energy Consumption</h2>

            <p>
              Energy usage distribution across monitored machines
            </p>
          </div>

          <div className="report-live-badge">
            ● Live Data
          </div>

        </div>


        <div className="machine-table-wrapper">

          <table className="machine-table">

            <thead>
              <tr>
                <th>Machine</th>
                <th>Energy Consumption</th>
                <th>Current Power</th>
                <th>Usage Share</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>

              {reportData.machines.map(
                (machine, index) => (

                  <tr key={index}>

                    <td>
                      <div className="machine-name">

                        <div className="machine-icon">
                          <Factory size={17} />
                        </div>

                        <span>
                          {machine.machine}
                        </span>

                      </div>
                    </td>


                    <td>
                      <strong>
                        {machine.energy} kWh
                      </strong>
                    </td>


                    <td>
                      {machine.power} kW
                    </td>


                    <td>

                      <div className="usage-cell">

                        <div className="usage-bar">

                          <div
                            className="usage-fill"
                            style={{
                              width: `${machine.percentage}%`,
                            }}
                          />

                        </div>

                        <span>
                          {machine.percentage}%
                        </span>

                      </div>

                    </td>


                    <td>

                      <span
                        className={`report-status ${machine.status.toLowerCase()}`}
                      >
                        {machine.status}
                      </span>

                    </td>

                  </tr>

                )
              )}

            </tbody>

          </table>

        </div>

      </div>


      {/* =====================================================
          DAILY ENERGY
          ===================================================== */}

      <div className="report-panel">

        <div className="report-panel-header">

          <div>
            <h2>Daily Energy Consumption</h2>

            <p>
              Energy consumption and estimated cost by day
            </p>
          </div>

        </div>


        <div className="daily-grid">

          {reportData.daily.map(
            (day, index) => (

              <div
                className="daily-card"
                key={index}
              >

                <div className="daily-date">
                  {day.date}
                </div>

                <div className="daily-energy">
                  {day.energy} kWh
                </div>

                <div className="daily-power">
                  {day.power} kW peak power
                </div>

                <div className="daily-cost">
                  ₹{day.cost.toFixed(2)}
                </div>

              </div>

            )
          )}

        </div>

      </div>


      {/* =====================================================
          ALERT SUMMARY
          ===================================================== */}

      <div className="report-bottom-grid">

        <div className="report-small-card">

          <div className="small-card-icon warning">
            <AlertTriangle size={20} />
          </div>

          <div>

            <span>Total Alerts</span>

            <strong>
              {reportData.totalAlerts}
            </strong>

            <p>
              {reportData.activeAlerts} currently active
            </p>

          </div>

        </div>


        <div className="report-small-card">

          <div className="small-card-icon saving">
            <TrendingDownIcon />
          </div>

          <div>

            <span>Energy Saving Potential</span>

            <strong>
              {reportData.energySaving}%
            </strong>

            <p>
              Based on optimization recommendations
            </p>

          </div>

        </div>

      </div>

    </div>
  );
}


/* =========================================================
   SMALL ICON COMPONENT
   ========================================================= */

function TrendingDownIcon() {
  return <TrendingUp size={20} />;
}


export default Reports;