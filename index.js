addEventListener('fetch', event => {
    event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
    // الموقع النهائي الذي سيتم توجيه الطلبات إليه
    const TARGET_URL = 'https://yourwebsite.com'; // استبدل بموقعك النهائي
    // الـ Referer المزيف (أو اتركه '' لإخفاء الـ Referer)
    const FAKE_REFERER = 'https://example.com'; // أو '' لإخفاء الـ Referer

    // استخراج المسار ومعلمات الطلب
    const url = new URL(request.url);
    const targetUrl = TARGET_URL + url.pathname + url.search;

    // إنشاء طلب جديد مع تعديل الرؤوس
    const modifiedRequest = new Request(targetUrl, {
        method: request.method,
        headers: {
            'Referer': FAKE_REFERER, // تعديل الـ Referer
            'Host': new URL(TARGET_URL).host,
            'X-Forwarded-For': request.headers.get('CF-Connecting-IP') || request.headers.get('X-Forwarded-For') || '',
        },
        body: request.body
    });

    // إرسال الطلب المعدل والحصول على الرد
    try {
        const response = await fetch(modifiedRequest);
        return response;
    } catch (error) {
        // إرجاع رسالة خطأ إذا فشل الطلب
        return new Response('Error fetching the target URL: ' + error.message, { status: 500 });
    }
}