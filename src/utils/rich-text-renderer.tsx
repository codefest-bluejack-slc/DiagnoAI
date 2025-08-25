import React from 'react';

export interface RichTextColors {
  header: string;
  subheader: string;
  bullet: string;
  numbered: string;
  emphasis: string;
  text: string;
}

export const colorSchemes = {
  purple: {
    header: 'text-white border-b border-purple-500/30',
    subheader: 'text-purple-100',
    bullet: 'text-purple-400',
    numbered: 'text-purple-100',
    emphasis: 'text-purple-100 font-medium',
    text: 'text-purple-200',
  },
  blue: {
    header: 'text-white border-b border-blue-500/30',
    subheader: 'text-blue-100',
    bullet: 'text-blue-400',
    numbered: 'text-blue-100',
    emphasis: 'text-blue-100 font-medium',
    text: 'text-blue-200',
  },
};

export const renderRichText = (
  text: string,
  colorScheme: 'purple' | 'blue' = 'purple',
) => {
  const colors = colorSchemes[colorScheme];

  let processedText = text
    .replace(/(\*\*[^*]+\*\*)/g, '\n$1\n')
    .replace(/(• [^•]+)/g, '\n$1')
    .replace(/\n+/g, '\n')
    .trim();

  return processedText.split('\n').map((line, index) => {
    line = line.trim();

    if (line === '') {
      return <div key={`empty-${index}`} className="h-3" />;
    }

    if (line.startsWith('**') && line.includes('**')) {
      const headerMatch = line.match(/\*\*([^*]+)\*\*/);
      if (headerMatch) {
        const headerText = headerMatch[1];
        const remainingText = line.replace(/\*\*[^*]+\*\*/, '').trim();

        return (
          <div key={`section-${index}`} className="my-3">
            <h4 className={`font-bold text-base pb-1 mb-2 ${colors.header}`}>
              {headerText}
            </h4>
            {remainingText && (
              <div className={`${colors.text}`}>{remainingText}</div>
            )}
          </div>
        );
      }
    }

    if (line.startsWith('**') && line.endsWith('**')) {
      const cleanLine = line.replace(/\*\*/g, '');
      return (
        <h4
          key={`section-${index}`}
          className={`font-bold mt-4 mb-2 text-base pb-1 ${colors.header}`}
        >
          {cleanLine}
        </h4>
      );
    }

    if (line.startsWith('###')) {
      const cleanLine = line.replace(/###/g, '').trim();
      return (
        <h5
          key={`subsection-${index}`}
          className={`font-semibold mt-3 mb-1 text-sm ${colors.subheader}`}
        >
          {cleanLine}
        </h5>
      );
    }

    if (line.startsWith('• ') || line.startsWith('- ')) {
      const bulletText = line.substring(2);
      return (
        <div
          key={`bullet-${index}`}
          className="flex items-start gap-3 my-2 ml-2"
        >
          <span className={`flex-shrink-0 mt-1 ${colors.bullet}`}>•</span>
          <span className={`flex-1 ${colors.text}`}>{bulletText}</span>
        </div>
      );
    }

    if (line.match(/^\d+\./)) {
      const parts = line.split(': ');
      return (
        <div key={`numbered-${index}`} className="my-2 ml-2">
          <span className={`font-semibold ${colors.numbered}`}>
            {parts[0]}:
          </span>
          <span className={`ml-2 ${colors.text}`}>
            {parts.slice(1).join(': ')}
          </span>
        </div>
      );
    }

    if (line.includes('*')) {
      let processedLine = line;
      processedLine = processedLine.replace(
        /\*\*([^*]+)\*\*/g,
        `<strong class="${colors.emphasis}">$1</strong>`,
      );
      processedLine = processedLine.replace(
        /\*([^*]+)\*/g,
        `<em class="${colors.emphasis}">$1</em>`,
      );

      return (
        <div
          key={`text-${index}`}
          className={`my-2 ${colors.text}`}
          dangerouslySetInnerHTML={{ __html: processedLine }}
        />
      );
    }

    return (
      <div
        key={`text-${index}`}
        className={`my-2 leading-relaxed ${colors.text}`}
      >
        {line}
      </div>
    );
  });
};
