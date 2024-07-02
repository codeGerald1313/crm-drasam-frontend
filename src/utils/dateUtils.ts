export function formatTimeAgo(value: string | number | Date): string {
    if (!value) {
        return '';
    }

    if (typeof value === 'string') {
        value = new Date(value);
    }

    const seconds = Math.floor((+new Date() - +value) / 1000);
    if (seconds < 29) {
        return 'Ahora';
    }

    const intervals: Record<string, number> = {
        'año': 31536000,
        'mes': 2592000,
        'semana': 604800,
        'día': 86400,
        'hora': 3600,
        'minuto': 60,
        'segundo': 1
    };

    for (const key in intervals) {
        if (Object.prototype.hasOwnProperty.call(intervals, key)) {
            const counter = Math.floor(seconds / intervals[key]);
            if (counter > 0) {
                if (counter === 1) {
                    return 'Hace ' + counter + ' ' + key;
                } else {
                    return 'Hace ' + counter + ' ' + key + 's';
                }
            }
        }
    }

    return value.toString();
}

// FORMATO 12 HORAS
export function formatTime(value: string | number | Date): string {
    let date: Date;
    
    if (typeof value === 'string') {
        date = new Date(value);
    } else if (typeof value === 'number') {
        date = new Date(value);
    } else if (value instanceof Date) {
        date = value;
    } else {
        return 'Cargando ...';
    }
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';

    const hours12 = hours % 12 || 12;
    const formattedTime = `${hours12}:${minutes.toString().padStart(2, '0')} ${ampm}`;

    return formattedTime;
}