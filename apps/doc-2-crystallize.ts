async function main(markdownFilePath: string) {
    const file = Bun.file(markdownFilePath);
    if (!(await file.exists())) {
        console.error(`File ${markdownFilePath} does not exist.`);
        process.exit(1);
    }
    const markdown = await file.text();
    const now = Math.floor(Date.now() / 1000);
    const hasher = new Bun.CryptoHasher('md5');
    const key = hasher.update(`${now}-X-${Bun.env.MARKDOWN_TO_CRYSTALLIZE_SHARED_KEY}`).digest('hex');
    const headers = {
        'Content-Type': 'text/plain',
        'X-Secure-Value': now.toFixed(0),
        'X-Secure-Signature': key,
    };
    const response = await fetch('https://bossman.crystallize.com/md2crystal', {
        method: 'POST',
        headers,
        body: markdown,
    });

    const result = await response.json();
    if (result.status === 'ok') {
        console.log(
            `Publish to Crystallize: https://app.crystallize.com/@${result.tenantIdentifier}/en/catalogue/${result.type}/${result.objectId}`,
        );
    } else {
        console.error(`File was not correctly published to Crystallize.`);
        if (result.error) {
            console.log(result.error);
        }
    }
}
main(process.argv[2]).catch(console.error);
