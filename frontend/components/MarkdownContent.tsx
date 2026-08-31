import React, { JSX } from 'react'

const MarkdownContent = ({ content }: { content: string }) => {
    // Handle empty or null content
    if (!content || !content.trim()) {
        return <p className="text-sm text-muted italic">No content available</p>;
    }
    
    const parseMarkdown = (text: string) => {
        const lines = text.split('\n');
        const elements: JSX.Element[] = [];
        let i = 0;
        
        while (i < lines.length) {
            const line = lines[i];
            
            // Horizontal rule
            if (line.trim() === '---') {
                elements.push(<hr key={i} className="my-6 border-border" />);
                i++;
                continue;
            }
            
            // Headers
            if (line.startsWith('### ')) {
                elements.push(
                    <h3 key={i} className="text-lg font-semibold text-foreground mt-4 mb-2">
                        {line.replace('### ', '')}
                    </h3>
                );
                i++;
                continue;
            }
            
            if (line.startsWith('## ')) {
                elements.push(
                    <h2 key={i} className="text-xl font-bold text-accent mt-5 mb-3">
                        {line.replace('## ', '')}
                    </h2>
                );
                i++;
                continue;
            }
            
            if (line.startsWith('# ')) {
                elements.push(
                    <h1 key={i} className="text-2xl font-bold text-foreground mt-6 mb-4">
                        {line.replace('# ', '')}
                    </h1>
                );
                i++;
                continue;
            }
            
            // Tables
            if (line.trim().startsWith('|') && i + 1 < lines.length && lines[i + 1].trim().includes('|---')) {
                const tableLines = [line];
                let j = i + 1;
                
                // Collect all table lines
                while (j < lines.length && lines[j].trim().startsWith('|')) {
                    tableLines.push(lines[j]);
                    j++;
                }
                
                // Parse table
                const headers = tableLines[0].split('|').filter(cell => cell.trim()).map(cell => cell.trim());
                const rows = tableLines.slice(2).map(row => 
                    row.split('|').filter(cell => cell.trim()).map(cell => cell.trim())
                );
                
                elements.push(
                    <div key={i} className="my-4 overflow-x-auto">
                        <table className="min-w-full border-collapse border border-border rounded-lg">
                            <thead className="bg-surface-secondary">
                                <tr>
                                    {headers.map((header, idx) => (
                                        <th key={idx} className="border border-border px-4 py-2 text-left text-sm font-semibold text-foreground">
                                            {header}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {rows.map((row, rowIdx) => (
                                    <tr key={rowIdx} className="hover:bg-surface-secondary/50">
                                        {row.map((cell, cellIdx) => (
                                            <td key={cellIdx} className="border border-border px-4 py-2 text-sm text-muted">
                                                {cell}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                );
                
                i = j;
                continue;
            }
            
            // Numbered lists
            if (/^\d+\.\s/.test(line.trim())) {
                const listItems = [];
                let j = i;
                
                while (j < lines.length && /^\d+\.\s/.test(lines[j].trim())) {
                    const text = lines[j].replace(/^\d+\.\s/, '').trim();
                    listItems.push(text);
                    j++;
                }
                
                elements.push(
                    <ol key={i} className="list-decimal list-inside space-y-1 my-2 sm:my-3 ml-1 sm:ml-4">
                        {listItems.map((item, idx) => (
                            <li key={idx} className="text-sm text-muted">{parseBold(item)}</li>
                        ))}
                    </ol>
                );
                
                i = j;
                continue;
            }
            
            // Bullet lists
            if (line.trim().startsWith('- ')) {
                const listItems = [];
                let j = i;
                
                while (j < lines.length && lines[j].trim().startsWith('- ')) {
                    const text = lines[j].replace(/^-\s/, '').trim();
                    listItems.push(text);
                    j++;
                }
                
                elements.push(
                    <ul key={i} className="list-disc list-inside space-y-1 my-2 sm:my-3 ml-1 sm:ml-4">
                        {listItems.map((item, idx) => (
                            <li key={idx} className="text-sm text-muted">{parseBold(item)}</li>
                        ))}
                    </ul>
                );
                
                i = j;
                continue;
            }
            
            // Bold text in paragraphs
            if (line.includes('**')) {
                elements.push(
                    <p key={i} className="text-sm text-muted mb-2">
                        {parseBold(line)}
                    </p>
                );
                i++;
                continue;
            }
            
            // Regular text
            if (line.trim()) {
                elements.push(<p key={i} className="text-sm text-muted mb-2">{line}</p>);
                i++;
                continue;
            }
            
            // Empty line
            elements.push(<div key={i} className="h-2" />);
            i++;
        }
        
        return elements;
    };
    
    // Helper function to parse bold text
    const parseBold = (text: string) => {
        const parts = text.split('**');
        return (
            <>
                {parts.map((part, i) => 
                    i % 2 === 1 ? (
                        <strong key={i} className="font-semibold text-accent">{part}</strong>
                    ) : (
                        <span key={i}>{part}</span>
                    )
                )}
            </>
        );
    };

    return <div className="space-y-1">{parseMarkdown(content)}</div>;
}

export default MarkdownContent
