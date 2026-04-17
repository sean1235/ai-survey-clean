let allData = [];
let filteredData = [];
let charts = {};

// 初始化
document.addEventListener('DOMContentLoaded', () => {
    loadData();
    initCharts();
    
    // 绑定过滤器事件
    document.getElementById('filter-type').addEventListener('change', filterData);
    document.getElementById('filter-start').addEventListener('change', filterData);
    document.getElementById('filter-end').addEventListener('change', filterData);
});

async function loadData() {
    try {
        console.log('正在从 API 加载数据...');
        const response = await fetch('/api/data');
        if (response.ok) {
            allData = await response.json();
            console.log('数据加载成功，条数:', allData.length);
        } else {
            throw new Error('API 响应异常: ' + response.status);
        }
    } catch (error) {
        console.error('加载数据失败:', error);
        alert('无法加载数据，请检查网络连接 / Failed to load data');
        allData = [];
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
    const todayCount = filteredData.filter(d => {
        const dateStr = d.submittedAt || d.timestamp;
        return dateStr && dateStr.startsWith(today);
    }).length;
    
    document.getElementById('student-count').textContent = studentCount;
    document.getElementById('teacher-count').textContent = teacherCount;
    document.getElementById('total-count').textContent = totalCount;
    document.getElementById('today-count').textContent = todayCount;
}

function initCharts() {
    // 确保 Canvas 元素存在
    const ctxStudent = document.getElementById('chart-student-level');
    const ctxUsage = document.getElementById('chart-deepseek-usage');
    const ctxTeacher = document.getElementById('chart-teacher-exp');
    const ctxTrend = document.getElementById('chart-daily-trend');

    if (ctxStudent) {
        charts.studentLevel = new Chart(ctxStudent, {
            type: 'pie',
            data: {
                labels: ['初级 Beginner', '中级 Intermediate', '高级 Advanced', '未考 Not taken'],
                datasets: [{
                    data: [0, 0, 0, 0],
                    backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0']
                }]
            },
            options: { responsive: true, plugins: { legend: { position: 'bottom' } } }
        });
    }
    
    if (ctxUsage) {
        charts.deepseekUsage = new Chart(ctxUsage, {
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
            options: { responsive: true, scales: { y: { beginAtZero: true } } }
        });
    }
    
    if (ctxTeacher) {
        charts.teacherExp = new Chart(ctxTeacher, {
            type: 'doughnut',
            data: {
                labels: ['<1年 <1yr', '1-3年 1-3yrs', '3-5年 3-5yrs', '>5年 >5yrs'],
                datasets: [{
                    data: [0, 0, 0, 0],
                    backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0']
                }]
            },
            options: { responsive: true, plugins: { legend: { position: 'bottom' } } }
        });
    }
    
    if (ctxTrend) {
        charts.dailyTrend = new Chart(ctxTrend, {
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
            options: { responsive: true, scales: { y: { beginAtZero: true } } }
        });
    }
}

function updateCharts() {
    if (charts.studentLevel) {
        const levelCounts = { A: 0, B: 0, C: 0, D: 0 };
        filteredData.filter(d => d.type === 'student').forEach(d => {
            const ans = d.responses || d.answers || {};
            if (ans.q1) levelCounts[ans.q1]++;
        });
        charts.studentLevel.data.datasets[0].data = [levelCounts.A, levelCounts.B, levelCounts.C, levelCounts.D];
        charts.studentLevel.update();
    }
    
    if (charts.deepseekUsage) {
        const studentUsage = { A: 0, B: 0, C: 0, D: 0 };
        const teacherUsage = { A: 0, B: 0, C: 0, D: 0 };
        filteredData.filter(d => d.type === 'student').forEach(d => {
            const ans = d.responses || d.answers || {};
            if (ans.q3) studentUsage[ans.q3]++;
        });
        filteredData.filter(d => d.type === 'teacher').forEach(d => {
            const ans = d.responses || d.answers || {};
            if (ans.q3) teacherUsage[ans.q3]++;
        });
        charts.deepseekUsage.data.datasets[0].data = [studentUsage.A, studentUsage.B, studentUsage.C, studentUsage.D];
        charts.deepseekUsage.data.datasets[1].data = [teacherUsage.A, teacherUsage.B, teacherUsage.C, teacherUsage.D];
        charts.deepseekUsage.update();
    }
    
    if (charts.teacherExp) {
        const expCounts = { A: 0, B: 0, C: 0, D: 0 };
        filteredData.filter(d => d.type === 'teacher').forEach(d => {
            const ans = d.responses || d.answers || {};
            if (ans.q1) expCounts[ans.q1]++;
        });
        charts.teacherExp.data.datasets[0].data = [expCounts.A, expCounts.B, expCounts.C, expCounts.D];
        charts.teacherExp.update();
    }
    
    if (charts.dailyTrend) {
        const dailyCounts = {};
        filteredData.forEach(d => {
            const dateStr = d.submittedAt || d.timestamp;
            if (dateStr) {
                const date = dateStr.split('T')[0];
                dailyCounts[date] = (dailyCounts[date] || 0) + 1;
            }
        });
        const sortedDates = Object.keys(dailyCounts).sort();
        const last7Days = sortedDates.slice(-7);
        charts.dailyTrend.data.labels = last7Days;
        charts.dailyTrend.data.datasets[0].data = last7Days.map(date => dailyCounts[date]);
        charts.dailyTrend.update();
    }
}

function updateTable() {
    const tbody = document.getElementById('table-body');
    if (!tbody) return;
    tbody.innerHTML = '';
    
    filteredData.forEach((item, index) => {
        const row = tbody.insertRow();
        const dateStr = item.submittedAt || item.timestamp;
        const ans = item.responses || item.answers || {};
        const region = ans.region || ans.q0 || 'N/A';
        
        // 构建答案摘要
        let answerSummary = '';
        Object.keys(ans).forEach(key => {
            if (key !== 'region' && key !== 'q0') {
                const value = Array.isArray(ans[key]) ? ans[key].join(', ') : ans[key];
                answerSummary += `${key}: ${value}; `;
            }
        });
        
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${region}</td>
            <td>${item.type === 'student' ? '学生 Student' : '教师 Teacher'}</td>
            <td>${dateStr ? new Date(dateStr).toLocaleString('zh-CN') : 'N/A'}</td>
            <td style="max-width: 300px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="${answerSummary}">
                ${answerSummary || 'N/A'}
            </td>
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
        const dateStr = item.submittedAt || item.timestamp;
        if (startDate && dateStr) {
            const itemDate = dateStr.split('T')[0];
            if (itemDate < startDate) return false;
        }
        if (endDate && dateStr) {
            const itemDate = dateStr.split('T')[0];
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

async function deleteItem(index) {
    if (confirm('确定要删除这条数据吗？ / Are you sure to delete this item?')) {
        const item = filteredData[index];
        try {
            const response = await fetch('/api/delete', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: item._id })
            });
            if (response.ok) {
                await loadData();
            } else {
                alert('删除失败 / Delete failed');
            }
        } catch (error) {
            console.error('删除失败:', error);
            alert('删除失败，请检查网络连接');
        }
    }
}

async function clearData() {
    if (confirm('确定要清空所有数据吗？此操作不可恢复！\nAre you sure to clear all data?')) {
        try {
            const response = await fetch('/api/clear', { method: 'POST' });
            if (response.ok) {
                await loadData();
            } else {
                alert('清空失败 / Clear failed');
            }
        } catch (error) {
            console.error('清空失败:', error);
            alert('清空失败，请检查网络连接');
        }
    }
}

function exportToExcel() {
    let csv = '\uFEFF'; // UTF-8 BOM
    csv += '序号,类型,提交时间,答案\n';
    filteredData.forEach((item, index) => {
        const ans = item.responses || item.answers || {};
        csv += `${index + 1},${item.type},${item.submittedAt || item.timestamp || 'N/A'},"${JSON.stringify(ans).replace(/"/g, '""')}"\n`;
    });
    downloadFile(csv, 'survey-data.csv', 'text/csv;charset=utf-8;');
}

function exportToCSV() { exportToExcel(); }

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
