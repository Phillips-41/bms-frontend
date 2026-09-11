export const dashboardData = {
  circleStatus: {
    totalMonitoredSites: 412,
    activeAlarms: 48,
    modemCommsUptime: "94.2%",
  },
  divisionAlarms: [
    { division: 'Bhusawal', count: 24 },
    { division: 'Savda', count: 18 },
    { division: 'Chalisgaon', count: 12 },
    { division: 'Raver', count: 8 },
    { division: 'Pachora', count: 6 },
  ],
  activeAlarmsLog: [
    { id: 1, type: 'Input Mains Fail', site: 'Site-Bhusawal-04', time: '10:45:32 AM', severity: 'CRITICAL' },
    { id: 2, type: 'DC Earth Fault', site: 'Site-Savda-11', time: '10:32:15 AM', severity: 'CRITICAL' },
    { id: 3, type: 'Charger Trip', site: 'Site-Chalisgaon-07', time: '10:15:50 AM', severity: 'CRITICAL' },
    { id: 4, type: 'Low Battery Voltage', site: 'Site-Bhusawal-09', time: '10:05:00 AM', severity: 'WARNING' },
    { id: 5, type: 'Over Temperature', site: 'Site-Raver-02', time: '09:50:22 AM', severity: 'WARNING' },
  ],
  supplierReliability: {
    categories: ['Supplier A', 'Supplier B'],
    series: [
      { name: 'Normal Operation', data: [480, 420], color: '#2ecc71' },
      { name: 'Failure due to High Temperature (>40°C)', data: [220, 180], color: '#e67e22' },
      { name: 'Failure due to High Cycle Count (>3000 Cycles)', data: [260, 200], color: '#e74c3c' }
    ]
  },
  assetStressMatrix: [
    // Low Wear (Green)
    { x: 15, y: 500, color: '#2ecc71' }, { x: 18, y: 800, color: '#2ecc71' }, { x: 22, y: 1200, color: '#2ecc71' },
    // Medium Wear (Orange)
    { x: 32, y: 2200, color: '#e67e22' }, { x: 38, y: 2800, color: '#e67e22' }, { x: 29, y: 1900, color: '#e67e22' },
    // High Wear (Red)
    { x: 45, y: 4200, color: '#ff4d4d', name: 'Site-Bhusawal-04 (45°C, 4200 Cycles)' },
    { x: 48, y: 3900, color: '#ff4d4d', name: 'Site-Savda-11 (48°C, 3900 Cycles)' },
    { x: 42, y: 3500, color: '#ff4d4d' }, { x: 46, y: 3800, color: '#ff4d4d' }
  ]
};