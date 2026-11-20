exports.handler = async (event) => {
  const siteId = process.env.NETLIFY_SITE_ID || process.env.SITE_ID;
  const token = process.env.NETLIFY_ACCESS_TOKEN;
  const pageUrl = event.queryStringParameters.page || '/';

  try {
       const dominio = ["api", "netlify", "com"].join(".");
    const url = "https://" + dominio + "/api/v1/sites/" + siteId + "/submissions";
    const response = await fetch(url, {
      headers: { Authorization: "Bearer " + token }
    });


    if (!response.ok) {
      throw new Error('Errore nella lettura dei commenti: ' + response.status);
    }

    const submissions = await response.json();

    const comments = submissions
      .filter(sub => sub.form_name === 'commenti' && (sub.data.page === pageUrl || (!sub.data.page && pageUrl === '/')))
      .map(sub => ({
        nome: sub.data.nome,
        messaggio: sub.data.messaggio,
        data: sub.created_at
      }));

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(comments)
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};


