/**
 * Lays child elements as a tile.
 * Columns count formula: el.width / el.firstChild.width.
 * Item width: el.firstChild.offsetWidth
 * ! NOTE: children width must be fixed  
 * @param el - parent element
 */
export const layAsTile = (el: HTMLElement, options?: { topMargin?: number, leftMargin?: number }) => {
    el.style.position = 'relative';
    if (el.children.length > 0) {
        const topMargin = options?.topMargin || 0;
        const leftMargin = options?.leftMargin || 0;
        const itemWidth = (el.firstChild as HTMLElement).offsetWidth;
        const columnsCount = Math.floor(el.offsetWidth / (itemWidth + leftMargin));
        const sideMargin = (el.offsetWidth - (itemWidth * columnsCount)) / 2;
        //used for storing bottom coordinates of upper element
        const columns = new Array(columnsCount).fill(0);
        const children = el.children;
        let i = 0;

        while (i < children.length) {
            let shortestColumnIndex = 0;

            for (let j = 1; j < columns.length; j++) {
                if (columns[j] < columns[shortestColumnIndex]) shortestColumnIndex = j;
            }

            const child = children.item(i) as HTMLElement;

            child.style.position = 'absolute';
            child.style.top = `${columns[shortestColumnIndex] + topMargin}px`;
            child.style.left = `${Math.round(sideMargin + (itemWidth + leftMargin) * shortestColumnIndex)}px`;

            columns[shortestColumnIndex] = child.offsetTop + child.offsetHeight;

            i++;
        }
        el.style.height = `${Math.max(...columns)}px`;
    }
};