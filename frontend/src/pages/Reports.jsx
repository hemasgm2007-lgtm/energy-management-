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
  // REPORT TYPE BASED CONTENT
  // =========================================================

  const getReportContent = () => {
    switch (reportType) {
      // -----------------------------------------------------
      // ENERGY CONSUMPTION
      // -----------------------------------------------------
      case "Energy Consumption":
        return {
          stats: [
            {
              label: "Total Energy",
              value: `${reportData.totalEnergy} kWh`,
              small: period,
              icon: <Zap size={21} />,
              iconClass: "blue",
            },
            {
              label: "Average Daily Energy",
              value: `${reportData.averageDailyEnergy} kWh`,
              small: "Daily average",
              icon: <TrendingUp size={21} />,
              iconClass: "orange",
            },
            {
              label: "Estimated Cost",
              value: `₹${reportData.estimatedCost.toLocaleString(
                "en-IN"
              )}`,
              small: "@ ₹8.50 / kWh",
              icon: <IndianRupee size={21} />,
              iconClass: "green",
            },
            {
              label: "Efficiency Improvement",
              value: `${reportData.efficiency}%`,
              small: "Compared with baseline",
              icon: <TrendingUp size={21} />,
              iconClass: "purple",
            },
          ],

          machineTitle: "Machine-wise Energy Consumption",
          machineDescription:
            "Energy usage distribution across monitored machines",

          dailyTitle: "Daily Energy Consumption",
          dailyDescription:
            "Energy consumption and estimated cost by day",
        };

      // -----------------------------------------------------
      // MACHINE PERFORMANCE
      // -----------------------------------------------------
      case "Machine Performance":
        return {
          stats: [
            {
              label: "Total Machines",
              value: `${reportData.machines.length}`,
              small: "Monitored machines",
              icon: <Factory size={21} />,
              iconClass: "blue",
            },
            {
              label: "Highest Energy Machine",
              value: "CNC Machine 01",
              small: "124.5 kWh consumption",
              icon: <Zap size={21} />,
              iconClass: "orange",
            },
            {
              label: "Peak Machine Power",
              value: "15.5 kW",
              small: "CNC Machine 01",
              icon: <TrendingUp size={21} />,
              iconClass: "green",
            },
            {
              label: "Average Efficiency",
              value: `${reportData.efficiency}%`,
              small: "Performance improvement",
              icon: <TrendingUp size={21} />,
              iconClass: "purple",
            },
          ],

          machineTitle: "Machine Performance",
          machineDescription:
            "Performance and energy usage across monitored machines",

          dailyTitle: "Daily Machine Performance",
          dailyDescription:
            "Daily energy and peak power measurements",
        };

      // -----------------------------------------------------
      // COST ANALYSIS
      // -----------------------------------------------------
      case "Cost Analysis":
        return {
          stats: [
            {
              label: "Total Energy Cost",
              value: `₹${reportData.estimatedCost.toLocaleString(
                "en-IN"
              )}`,
              small: period,
              icon: <IndianRupee size={21} />,
              iconClass: "green",
            },
            {
              label: "Average Daily Cost",
              value: `₹${(
                reportData.estimatedCost / reportData.daily.length
              ).toFixed(2)}`,
              small: "Daily average",
              icon: <TrendingUp size={21} />,
              iconClass: "orange",
            },
            {
              label: "Energy Rate",
              value: "₹8.50 / kWh",
              small: "Current tariff",
              icon: <Zap size={21} />,
              iconClass: "blue",
            },
            {
              label: "Potential Saving",
              value: `${reportData.energySaving}%`,
              small: "Optimization potential",
              icon: <TrendingUp size={21} />,
              iconClass: "purple",
            },
          ],

          machineTitle: "Machine-wise Energy Cost",
          machineDescription:
            "Estimated energy cost contribution by machine",

          dailyTitle: "Daily Cost Analysis",
          dailyDescription:
            "Daily energy cost and consumption breakdown",
        };

      // -----------------------------------------------------
      // ENERGY EFFICIENCY
      // -----------------------------------------------------
      case "Energy Efficiency":
        return {
          stats: [
            {
              label: "Efficiency Improvement",
              value: `${reportData.efficiency}%`,
              small: "Compared with baseline",
              icon: <TrendingUp size={21} />,
              iconClass: "purple",
            },
            {
              label: "Energy Saving",
              value: `${reportData.energySaving}%`,
              small: "Optimization potential",
              icon: <Zap size={21} />,
              iconClass: "blue",
            },
            {
              label: "Energy Consumed",
              value: `${reportData.totalEnergy} kWh`,
              small: period,
              icon: <Factory size={21} />,
              iconClass: "orange",
            },
            {
              label: "Estimated Cost",
              value: `₹${reportData.estimatedCost.toLocaleString(
                "en-IN"
              )}`,
              small: "Current period",
              icon: <IndianRupee size={21} />,
              iconClass: "green",
            },
          ],

          machineTitle: "Machine-wise Efficiency",
          machineDescription:
            "Energy efficiency and utilization across monitored machines",

          dailyTitle: "Daily Efficiency Analysis",
          dailyDescription:
            "Daily energy consumption and efficiency indicators",
        };

      default:
        return {
          stats: [],
          machineTitle: "Machine-wise Energy Consumption",
          machineDescription:
            "Energy usage distribution across monitored machines",
          dailyTitle: "Daily Energy Consumption",
          dailyDescription:
            "Energy consumption and estimated cost by day",
        };
    }
  };

  const reportContent = getReportContent();

  // =========================================================
  // CSV DOWNLOAD
  // =========================================================

  const downloadCSV = () => {
    let rows = [];

    // ENERGY CONSUMPTION
    if (reportType === "Energy Consumption") {
      rows = [
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
    }

    // MACHINE PERFORMANCE
    else if (reportType === "Machine Performance") {
      rows = [
        [
          "Machine",
          "Energy (kWh)",
          "Power (kW)",
          "Usage Share (%)",
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
    }

    // COST ANALYSIS
    else if (reportType === "Cost Analysis") {
      rows = [
        [
          "Machine",
          "Energy (kWh)",
          "Estimated Cost (Rs.)",
          "Usage Share (%)",
        ],
        ...reportData.machines.map((machine) => [
          machine.machine,
          machine.energy,
          (machine.energy * 8.5).toFixed(2),
          machine.percentage,
        ]),
      ];
    }

    // ENERGY EFFICIENCY
    else if (reportType === "Energy Efficiency") {
      rows = [
        [
          "Machine",
          "Energy (kWh)",
          "Power (kW)",
          "Efficiency Indicator (%)",
          "Status",
        ],
        ...reportData.machines.map((machine) => [
          machine.machine,
          machine.energy,
          machine.power,
          (100 - machine.percentage / 2).toFixed(1),
          machine.status,
        ]),
      ];
    }

    const csvContent = rows
      .map((row) =>
        row
          .map((value) =>
            `"${String(value).replace(/"/g, '""')}"`
          )
          .join(",")
      )
      .join("\n");

    const blob = new Blob([csvContent], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;

    link.download = `${reportType
      .toLowerCase()
      .replace(/\s+/g, "-")}-report.csv`;

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

    doc.text(
      "Smart Energy Monitoring Report",
      14,
      20
    );

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

    doc.text(
      `${reportType} Summary`,
      14,
      46
    );

    let summaryHead = [];
    let summaryBody = [];

    if (reportType === "Energy Consumption") {
      summaryHead = [
        [
          "Total Energy",
          "Current Power",
          "Estimated Cost",
          "Energy Saving",
        ],
      ];

      summaryBody = [
        [
          `${reportData.totalEnergy} kWh`,
          `${reportData.totalPower} kW`,
          `Rs. ${reportData.estimatedCost.toFixed(2)}`,
          `${reportData.energySaving}%`,
        ],
      ];
    }

    else if (reportType === "Machine Performance") {
      summaryHead = [
        [
          "Total Machines",
          "Highest Energy",
          "Peak Power",
          "Efficiency",
        ],
      ];

      summaryBody = [
        [
          reportData.machines.length,
          "CNC Machine 01",
          "15.5 kW",
          `${reportData.efficiency}%`,
        ],
      ];
    }

    else if (reportType === "Cost Analysis") {
      summaryHead = [
        [
          "Total Cost",
          "Average Daily Cost",
          "Energy Rate",
          "Potential Saving",
        ],
      ];

      summaryBody = [
        [
          `Rs. ${reportData.estimatedCost.toFixed(2)}`,
          `Rs. ${(
            reportData.estimatedCost /
            reportData.daily.length
          ).toFixed(2)}`,
          "Rs. 8.50 / kWh",
          `${reportData.energySaving}%`,
        ],
      ];
    }

    else if (reportType === "Energy Efficiency") {
      summaryHead = [
        [
          "Efficiency Improvement",
          "Energy Saving",
          "Total Energy",
          "Estimated Cost",
        ],
      ];

      summaryBody = [
        [
          `${reportData.efficiency}%`,
          `${reportData.energySaving}%`,
          `${reportData.totalEnergy} kWh`,
          `Rs. ${reportData.estimatedCost.toFixed(2)}`,
        ],
      ];
    }

    autoTable(doc, {
      startY: 51,

      head: summaryHead,

      body: summaryBody,

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
      reportContent.machineTitle,
      14,
      machineStartY
    );

    let machineHead = [];
    let machineBody = [];

    if (reportType === "Cost Analysis") {
      machineHead = [
        [
          "Machine",
          "Energy (kWh)",
          "Cost (Rs.)",
          "Share",
        ],
      ];

      machineBody = reportData.machines.map(
        (machine) => [
          machine.machine,
          machine.energy,
          (machine.energy * 8.5).toFixed(2),
          `${machine.percentage}%`,
        ]
      );
    }

    else if (reportType === "Energy Efficiency") {
      machineHead = [
        [
          "Machine",
          "Energy (kWh)",
          "Power (kW)",
          "Efficiency",
          "Status",
        ],
      ];

      machineBody = reportData.machines.map(
        (machine) => [
          machine.machine,
          machine.energy,
          machine.power,
          `${(100 - machine.percentage / 2).toFixed(1)}%`,
          machine.status,
        ]
      );
    }

    else {
      machineHead = [
        [
          "Machine",
          "Energy (kWh)",
          "Power (kW)",
          "Share",
          "Status",
        ],
      ];

      machineBody = reportData.machines.map(
        (machine) => [
          machine.machine,
          machine.energy,
          machine.power,
          `${machine.percentage}%`,
          machine.status,
        ]
      );
    }

    autoTable(doc, {
      startY: machineStartY + 5,

      head: machineHead,

      body: machineBody,

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
      reportContent.dailyTitle,
      14,
      dailyStartY
    );

    let dailyHead = [];
    let dailyBody = [];

    if (reportType === "Cost Analysis") {
      dailyHead = [
        [
          "Date",
          "Energy (kWh)",
          "Power (kW)",
          "Cost (Rs.)",
        ],
      ];

      dailyBody = reportData.daily.map((day) => [
        day.date,
        day.energy,
        day.power,
        day.cost.toFixed(2),
      ]);
    }

    else if (reportType === "Energy Efficiency") {
      dailyHead = [
        [
          "Date",
          "Energy (kWh)",
          "Power (kW)",
          "Efficiency",
        ],
      ];

      dailyBody = reportData.daily.map((day) => [
        day.date,
        day.energy,
        day.power,
        `${(
          100 -
          (day.energy / reportData.totalEnergy) * 20
        ).toFixed(1)}%`,
      ]);
    }

    else {
      dailyHead = [
        [
          "Date",
          "Energy (kWh)",
          "Power (kW)",
          "Cost (Rs.)",
        ],
      ];

      dailyBody = reportData.daily.map((day) => [
        day.date,
        day.energy,
        day.power,
        day.cost.toFixed(2),
      ]);
    }

    autoTable(doc, {
      startY: dailyStartY + 5,

      head: dailyHead,

      body: dailyBody,

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

    doc.save(
      `${reportType
        .toLowerCase()
        .replace(/\s+/g, "-")}-report.pdf`
    );
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

        {reportContent.stats.map((stat, index) => (

          <div
            className="report-stat-card"
            key={index}
          >

            <div
              className={`report-stat-icon ${stat.iconClass}`}
            >
              {stat.icon}
            </div>

            <div>

              <span>
                {stat.label}
              </span>

              <strong>
                {stat.value}
              </strong>

              <small>
                {stat.small}
              </small>

            </div>

          </div>

        ))}

      </div>


      {/* =====================================================
          MACHINE REPORT
          ===================================================== */}

      <div className="report-panel">

        <div className="report-panel-header">

          <div>

            <h2>
              {reportContent.machineTitle}
            </h2>

            <p>
              {reportContent.machineDescription}
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

                <th>
                  Machine
                </th>

                <th>
                  Energy Consumption
                </th>

                <th>
                  Current Power
                </th>

                <th>
                  Usage Share
                </th>

                <th>
                  Status
                </th>

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
          DAILY REPORT
          ===================================================== */}

      <div className="report-panel">

        <div className="report-panel-header">

          <div>

            <h2>
              {reportContent.dailyTitle}
            </h2>

            <p>
              {reportContent.dailyDescription}
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

            <span>
              Total Alerts
            </span>

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

            <span>
              Energy Saving Potential
            </span>

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