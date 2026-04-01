async function nextQuestion() {
    console.log("nextQuestion: قبل الزيادة", appState.currentQuestionIndex);
    stopAllSounds();
    appState.showFeedback = false;
    appState.currentQuestionIndex++;
    console.log("nextQuestion: بعد الزيادة", appState.currentQuestionIndex);
    
    if (appState.currentQuestionIndex >= appState.questions.length) {
        // نهاية الاختبار
        console.log("انتهى الاختبار، بدء حفظ النتيجة...");
        const total = appState.questions.length;
        const percentage = Math.round((appState.score / total) * 100);
        const answersDetail = {};
        appState.questions.forEach((q, idx) => {
            answersDetail[idx] = { 
                question: q.text, 
                userAnswer: appState.answers[idx] || "انتهى الوقت", 
                correctAnswer: q.correct 
            };
        });
        
        // حفظ النتيجة في Firebase
        try {
            await saveResultToFirebase(appState.studentName, appState.score, total, percentage, answersDetail);
            console.log("تم حفظ النتيجة بنجاح");
        } catch (error) {
            console.error("خطأ في حفظ النتيجة:", error);
            showToast("❌ فشل حفظ النتيجة، لكن سيتم عرض النتيجة", true);
        }
        
        // تشغيل الصوت
        if (percentage >= 50) playSuccessSound();
        else playFailSound();
        
        // تغيير المرحلة وإعادة العرض
        appState.stage = "result";
        console.log("الانتقال إلى صفحة النتيجة");
        render();
    } else {
        console.log("الانتقال للسؤال التالي");
        appState.selectedOptionValue = null;
        render();
    }
}
