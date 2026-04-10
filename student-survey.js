let currentQuestion = 1;
let answers = {};
let questionFlow = [1, 2, 3]; // 初始流程

// 跳转逻辑映射
const jumpLogic = {
    3: (answer) => {
        if (answer === 'D') return 4; // 选D去第4题
        return 5; // 选A/B/C跳到第5题
    },
    4: (answer) => {
        if (answer === 'D') return 'thank-you'; // 选D结束问卷
        return 5; // 选A/B/C继续第5题
    },
    6: (answer) => {
        if (answer === 'D') return 9; // 选D跳到第9题
        return 7; // 选A/B/C继续第7题
    }
};

function updateProgress() {
    const totalQuestions = 13;
    document.getElementById('progress-text').textContent = 
        `问题 ${currentQuestion} / ${totalQuestions} | Question ${currentQuestion} / ${totalQuestions}`;
}

function showQuestion(questionNum) {
    document.querySelectorAll('.question').forEach(q => q.classList.remove('active'));
    const questionElement = document.querySelector(`[data-question="${questionNum}"]`);
    if (questionElement) {
        questionElement.classList.add('active');
        currentQuestion = questionNum;
        updateProgress();
        updateNavigationButtons();
        window.scrollTo(0, 0);
    }
}

function updateNavigationButtons() {
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    
    prevBtn.disabled = currentQuestion === 1;
    
    if (currentQuestion === 'thank-you') {
        nextBtn.style.display = 'none';
        prevBtn.style.display = 'none';
    } else if (currentQuestion === 13) {
        nextBtn.textContent = '提交 Submit';
    } else {
        nextBtn.textContent = '下一题 Next';
    }
}

function validateCurrentQuestion() {
    const currentQ = document.querySelector(`[data-question="${currentQuestion}"]`);
    
    // 单选题验证
    const radioInputs = currentQ.querySelectorAll('input[type="radio"]');
    if (radioInputs.length > 0) {
        const radioName = radioInputs[0].name;
        const checked = currentQ.querySelector(`input[name="${radioName}"]:checked`);
        if (!checked) {
            alert('请选择一个选项 / Please select an option');
            return false;
        }
    }
    
    // 多选题至少选一个（第5、9、12题）
    if ([5, 9, 12].includes(currentQuestion)) {
        const checkboxes = currentQ.querySelectorAll('input[type="checkbox"]:checked');
        if (checkboxes.length === 0) {
            alert('请至少选择一个选项 / Please select at least one option');
            return false;
        }
    }
    
    return true;
}

function saveAnswer() {
    const currentQ = document.querySelector(`[data-question="${currentQuestion}"]`);
    
    // 保存单选答案
    const radioInputs = currentQ.querySelectorAll('input[type="radio"]');
    if (radioInputs.length > 0) {
        const radioName = radioInputs[0].name;
        const checked = currentQ.querySelector(`input[name="${radioName}"]:checked`);
        if (checked) {
            answers[radioName] = checked.value;
        }
    }
    
    // 保存多选答案
    const checkboxInputs = currentQ.querySelectorAll('input[type="checkbox"]');
    if (checkboxInputs.length > 0) {
        const checkboxName = checkboxInputs[0].name;
        const checkedBoxes = currentQ.querySelectorAll(`input[name="${checkboxName}"]:checked`);
        answers[checkboxName] = Array.from(checkedBoxes).map(cb => cb.value);
    }
    
    // 保存文本答案
    const textInputs = currentQ.querySelectorAll('input[type="text"], textarea');
    textInputs.forEach(input => {
        if (input.name && input.value) {
            answers[input.name] = input.value;
        }
    });
}

function getNextQuestion() {
    saveAnswer();
    
    // 检查是否有跳转逻辑
    if (jumpLogic[currentQuestion]) {
        const answer = answers[`q${currentQuestion}`];
        return jumpLogic[currentQuestion](answer);
    }
    
    // 默认顺序前进
    if (currentQuestion === 13) {
        return 'thank-you';
    }
    return currentQuestion + 1;
}

function nextQuestion() {
    if (!validateCurrentQuestion()) {
        return;
    }
    
    if (currentQuestion === 13) {
        submitSurvey();
        return;
    }
    
    const nextQ = getNextQuestion();
    showQuestion(nextQ);
}

function previousQuestion() {
    if (currentQuestion > 1) {
        showQuestion(currentQuestion - 1);
    }
}

async function submitSurvey() {
    saveAnswer();
    
    const surveyData = {
        type: 'student',
        answers: answers,
        timestamp: new Date().toISOString()
    };
    
    try {
        const response = await fetch('/api/submit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(surveyData)
        });
        
        if (response.ok) {
            showQuestion('thank-you');
        } else {
            // 如果API失败，保存到本地存储作为备份
            saveToLocalStorage(surveyData);
            showQuestion('thank-you');
        }
    } catch (error) {
        console.error('提交失败:', error);
        saveToLocalStorage(surveyData);
        showQuestion('thank-you');
    }
}

function saveToLocalStorage(data) {
    const existingData = JSON.parse(localStorage.getItem('surveyData') || '[]');
    existingData.push(data);
    localStorage.setItem('surveyData', JSON.stringify(existingData));
}

// 初始化
document.addEventListener('DOMContentLoaded', () => {
    showQuestion(1);
});
