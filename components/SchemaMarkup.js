import Script from 'next/script';

const SchemaMarkup = ({ schema }) => {
    return (
        <Script
            id="schema-markup"
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
    );
};

export default SchemaMarkup;
