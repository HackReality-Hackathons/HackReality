import React, { useState, useEffect } from 'react';

export interface ScheduleItem {
  time: string;
  endTime?: string;
  title: string;
  type: 'event' | 'talk' | 'workshop' | 'break' | 'registration';
  url: string; // Nueva propiedad
}

interface ScheduleComponentProps {
  initialSchedule: ScheduleItem[];
  registrationEndDate: string;
}

const ScheduleComponent: React.FC<ScheduleComponentProps> = ({ initialSchedule, registrationEndDate }) => {
  const [schedule, setSchedule] = useState<ScheduleItem[]>(initialSchedule);
  const [currentTime, setCurrentTime] = useState<Date>(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const isRegistrationOpen = () => {
    const endDate = new Date(registrationEndDate);
    return currentTime < endDate;
  };

  const isCurrentOrPast = (time: string) => {
    const [hours, minutes] = time.split(':').map(Number);
    const eventTime = new Date(currentTime);
    eventTime.setHours(hours, minutes, 0, 0);
    return currentTime >= eventTime;
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="bg-black/30 backdrop-blur-sm rounded-lg p-6 border border-purple-500/20">
      <div className="mb-4 text-center">
        <span className="text-2xl font-bold text-green-400">Hora actual: {formatTime(currentTime)}</span>
      </div>
      <ul className="space-y-4">
        {isRegistrationOpen() ? (
          <li className="flex items-center p-4 rounded-lg bg-purple-900/50">
            <a href="https://hackreality-spatial-computing.devpost.com/" target='_blank' className="flex items-center w-full hover:bg-purple-800/50 transition-colors rounded-lg p-2">
              <span className="text-xl font-bold text-green-400 mr-4">Registro abierto</span>
              <div className="flex-grow">
                <h3 className="text-lg font-semibold text-white">Registro para HackReality 2024</h3>
                <span className="text-sm text-gray-500">Abierto hasta el {new Date(registrationEndDate).toLocaleString('es-ES', { dateStyle: 'long', timeStyle: 'short' })}</span>
              </div>
            </a>
          </li>
        ) : (
          schedule.map((item, index) => (
            <li 
              key={index} 
              className={`flex items-center p-4 rounded-lg transition-all ${
                isCurrentOrPast(item.time) ? 'bg-purple-900/50' : 'bg-black/50'
              }`}
            >
              <a href={item.url} className="flex items-center w-full hover:bg-purple-800/50 transition-colors rounded-lg p-2">
                <span className="text-xl font-bold text-green-400 mr-4">
                  {item.time}{item.endTime ? ` - ${item.endTime}` : ''}
                </span>
                <div className="flex-grow">
                  <h3 className="text-lg font-semibold text-white">{item.title}</h3>
                  <span className={`text-sm ${
                    item.type === 'talk' ? 'text-blue-300' :
                    item.type === 'workshop' ? 'text-yellow-300' :
                    item.type === 'break' ? 'text-red-300' :
                    item.type === 'registration' ? 'text-gray-500' : 'text-gray-300'
                  }`}>
                    {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                  </span>
                </div>
                {isCurrentOrPast(item.time) && (
                  <span className="text-green-400 ml-4">
                    {item.time === formatTime(currentTime) ? 'En curso' : 'Finalizado'}
                  </span>
                )}
              </a>
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default ScheduleComponent;

