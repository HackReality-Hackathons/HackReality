import React, { useState, useEffect } from 'react';

interface ScheduleItem {
  time: string;
  title: string;
  type: 'event' | 'talk' | 'workshop' | 'break';
}

interface ScheduleComponentProps {
  initialSchedule: ScheduleItem[];
}

export const Schedule: React.FC<ScheduleComponentProps> = ({ initialSchedule }) => {
  const [schedule, setSchedule] = useState<ScheduleItem[]>(initialSchedule);
  const [currentTime, setCurrentTime] = useState<string>('');

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const isCurrentOrPast = (itemTime: string) => {
    const [itemHour, itemMinute] = itemTime.split(':').map(Number);
    const [currentHour, currentMinute] = currentTime.split(':').map(Number);

    if (currentHour > itemHour) return true;
    if (currentHour === itemHour && currentMinute >= itemMinute) return true;
    return false;
  };

  return (
    <div className="bg-black/30 backdrop-blur-sm rounded-lg p-6 border border-purple-500/20">
      <div className="mb-4 text-center">
        <span className="text-2xl font-bold text-green-400">Hora actual: {currentTime}</span>
      </div>
      <ul className="space-y-4">
        {schedule.map((item, index) => (
          <li 
            key={index} 
            className={`flex items-center p-4 rounded-lg transition-all ${
              isCurrentOrPast(item.time) ? 'bg-purple-900/50' : 'bg-black/50'
            }`}
          >
            <span className="text-xl font-bold text-green-400 mr-4">{item.time}</span>
            <div className="flex-grow">
              <h3 className="text-lg font-semibold text-white">{item.title}</h3>
              <span className={`text-sm ${
                item.type === 'talk' ? 'text-blue-300' :
                item.type === 'workshop' ? 'text-yellow-300' :
                item.type === 'break' ? 'text-red-300' : 'text-gray-300'
              }`}>
                {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
              </span>
            </div>
            {isCurrentOrPast(item.time) && (
              <span className="text-green-400 ml-4 text-lg font-bold">
                {item.time === currentTime.slice(0, 5) ? 'En curso' : 'Finalizado'}
              </span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};