let allData = [];
let filteredData = [];
let charts = {};

// 初始化
document.addEventListener('DOMContentLoaded', () => {
    loadData();
    initCharts();
});

async function loadData() {
    try {
        // 尝试从API加载
        const response = await fetch('/api/data');
        if (response.ok) {
            allData = await response.json();
        } else {
            throw new Error('API not available');
        }
    } catch (error) {
        // 如果API不可用，从本地存储加载
        allData = JSON.parse(localStorage.getItem('surveyData') || '[]');
    }
    
    filteredData = allData;
    updateStats();
    updateCharts();
    updateTable();
}

function updateStats() {
    const studentCount = filteredData.filter(d => d.type === 'student').length;
    const teacherCount = filteredData.filter(d => d.type === 'teacher').length;
    const totalCount = filteredData.length;
    
    const today = new Date().toISOString().split('T')[0];
    const todayCount = filteredData.filter(d => 
        d.timestamp && d.timestamp.startsWith(today)
    ).length;
    
    document.getElementById('student-count').textContent = studentCount;
    document.getElementById('teacher-count').textContent = teacherCount;
    document.getElementById('total-count').textContent = totalCount;
    document.getElementById('today-count').textContent = todayCount;
}

function initCharts() {
    // 学生中文水平分布
    charts.studentLevel = new Chart(document.getElementById('chart-student-level'), {
        type: 'pie',
        data: {
            labels: ['初级 Beginner', '中级 Intermediate', '高级 Advanced', '未考 Not taken'],
            datasets: [{
                data: [0, 0, 0, 0],
                backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0']
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { position: 'bottom' }
            }
        }
    });
    
    // DeepSeek使用频率
    charts.deepseekUsage = new Chart(document.getElementById('chart-deepseek-usage'), {
        type: 'bar',
        data: {
            labels: ['经常 Often', '偶尔 Sometimes', '很少 Rarely', '从未 Never'],
            datasets: [{
                label: '学生 Students',
                data: [0, 0, 0, 0],
                backgroundColor: '#667eea'
            }, {
                label: '教师 Teachers',
                data: [0, 0, 0, 0],
                backgroundColor: '#764ba2'
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: { beginAtZero: true }
            }
        }
    });
    
    // 教师教龄分布
    charts.teacherExp = new Chart(document.getElementById('chart-teacher-exp'), {
        type: 'doughnut',
        data: {
            labels: ['<1年 <1yr', '1-3年 1-3yrs', '3-5年 3-5yrs', '>5年 >5yrs'],
            datasets: [{
                data: [0, 0, 0, 0],
                backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0']
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { position: 'bottom' }
            }
        }
    });
    
    // 每日提交趋势
    charts.dailyTrend = new Chart(document.getElementById('chart-daily-trend'), {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: '提交数 Submissions',
                data: [],
                borderColor: '#667eea',
                backgroundColor: 'rgba(102, 126, 234, 0.1)',
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: { beginAtZero: true }
            }
        }
    });
}

function updateCharts() {
    // 更新学生中文水平分布
    const levelCounts = { A: 0, B: 0, C: 0, D: 0 };
    filteredData.filter(d => d.type === 'student').forEach(d => {
        if (d.answers.q1) levelCounts[d.answers.q1]++;
    });
    charts.studentLevel.data.datasets[0].data = [
        levelCounts.A, levelCounts.B, levelCounts.C, levelCounts.D
    ];
    charts.studentLevel.update();
    
    // 更新DeepSeek使用频率
    const studentUsage = { A: 0, B: 0, C: 0, D: 0 };
    const teacherUsage = { A: 0, B: 0, C: 0, D: 0 };
    
    filteredData.filter(d => d.type === 'student').forEach(d => {
        if (d.answers.q3) studentUsage[d.answers.q3]++;
    });
    
    filteredData.filter(d => d.type === 'teacher').forEach(d => {
        if (d.answers.q3) teacherUsage[d.answers.q3]++;
    });
    
    charts.deepseekUsage.data.datasets[0].data = [
        studentUsage.A, studentUsage.B, studentUsage.C, studentUsage.D
    ];
    charts.deepseekUsage.data.datasets[1].data = [
        teacherUsage.A, teacherUsage.B, teacherUsage.C, teacherUsage.D
    ];
    charts.deepseekUsage.update();
    
    // 更新教师教龄分布
    const expCounts = { A: 0, B: 0, C: 0, D: 0 };
    filteredData.filter(d => d.type === 'teacher').forEach(d => {
        if (d.answers.q1) expCounts[d.answers.q1]++;
    });
    charts.teacherExp.data.datasets[0].data = [
        expCounts.A, expCounts.B, expCounts.C, expCounts.D
    ];
    charts.teacherExp.update();
    
    // 更新每日提交趋势
    const dailyCounts = {};
    filteredData.forEach(d => {
        if (d.timestamp) {
            const date = d.timestamp.split('T')[0];
            dailyCounts[date] = (dailyCounts[date] || 0) + 1;
        }
    });
    
    const sortedDates = Object.keys(dailyCounts).sort();
    const last7Days = sortedDates.slice(-7);
    
    charts.dailyTrend.data.labels = last7Days;
    charts.dailyTrend.data.datasets[0].data = last7Days.map(date => dailyCounts[date]);
    charts.dailyTrend.update();
}

function updateTable() {
    const tbody = document.getElementById('table-body');
    tbody.innerHTML = '';
    
    filteredData.forEach((item, index) => {
        const row = tbody.insertRow();
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${item.type === 'student' ? '学生 Student' : '教师 Teacher'}</td>
            <td>${item.timestamp ? new Date(item.timestamp).toLocaleString('zh-CN') : 'N/A'}</td>
            <td>
                <button onclick="viewDetail(${index})" style="padding: 5px 10px; background: #667eea; color: white; border: none; border-radius: 5px; cursor: pointer;">
                    查看详情 View
                </button>
                <button onclick="deleteItem(${index})" style="padding: 5px 10px; background: #f44336; color: white; border: none; border-radius: 5px; cursor: pointer; margin-left: 5px;">
                    删除 Delete
                </button>
            </td>
        `;
    });
}

function filterData() {
    const type = document.getElementById('filter-type').value;
    const startDate = document.getElementById('filter-start').value;
    const endDate = document.getElementById('filter-end').value;
    
    filteredData = allData.filter(item => {
        if (type !== 'all' && item.type !== type) return false;
        
        if (startDate && item.timestamp) {
            const itemDate = item.timestamp.split('T')[0];
            if (itemDate < startDate) return false;
        }
        
        if (endDate && item.timestamp) {
            const itemDate = item.timestamp.split('T')[0];
            if (itemDate > endDate) return false;
        }
        
        return true;
    });
    
    updateStats();
    updateCharts();
    updateTable();
}

function viewDetail(index) {
    const item = filteredData[index];
    const detail = JSON.stringify(item, null, 2);
    alert('详细数据 / Detailed Data:\n\n' + detail);
}

function deleteItem(index) {
    if (confirm('确定要删除这条数据吗？ / Are you sure to delete this item?')) {
        const item = filteredData[index];
        const globalIndex = allData.indexOf(item);
        allData.splice(globalIndex, 1);
        
        // 保存到本地存储
        localStorage.setItem('surveyData', JSON.stringify(allData));
        
        // 如果有API，也发送删除请求
        fetch('/api/delete', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: item._id || item.timestamp })
        }).catch(err => console.log('API delete failed:', err));
        
        loadData();
    }
}

function clearData() {
    if (confirm('确定要清空所有数据吗？此操作不可恢复！\nAre you sure to clear all data? This cannot be undone!')) {
        allData = [];
        localStorage.setItem('surveyData', JSON.stringify(allData));
        
        fetch('/api/clear', { method: 'POST' })
            .catch(err => console.log('API clear failed:', err));
        
        loadData();
    }
}

function exportToExcel() {
    // 简单的CSV格式导出（Excel可以打开）
    let csv = '\uFEFF'; // UTF-8 BOM
    csv += '序号,类型,提交时间,答案\n';
    
    filteredData.forEach((item, index) => {
        csv += `${index + 1},${item.type},${item.timestamp || 'N/A'},"${JSON.stringify(item.answers).replace(/"/g, '""')}"\n`;
    });
    
    downloadFile(csv, 'survey-data.csv', 'text/csv;charset=utf-8;');
}

function exportToCSV() {
    exportToExcel(); // 使用相同的导出逻辑
}

function downloadFile(content, filename, type) {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}
