import React, { useState, useEffect } from 'react';
import { Clock, PlayCircle, CheckCircle, HelpCircle } from 'lucide-react';

interface ScheduleItem {
  time: string;
  endTime?: string;
  event: string;
  status: 'upcoming' | 'in-progress' | 'ended';
  type: 'event' | 'talk' | 'workshop' | 'break' | 'registration';
  url?: string;
}

interface ScheduleData {
  [key: string]: ScheduleItem[];
}

const schedule: ScheduleData = {
  'Viernes': [
    { time: '12:00', endTime: '17:00', event: 'Registro y Formación de Equipos', status: 'in-progress', type: 'registration', url: 'https://hackreality-spatial-computing.devpost.com/' },
    { time: '17:00', endTime: '18:00', event: 'Ceremonia de apertura', status: 'upcoming', type: 'event' },
    { time: '18:00', endTime: '23:59', event: 'Hacking', status: 'upcoming', type: 'event' },
  ],
  'Sábado': [
    { time: '00:00', endTime: '23:59', event: 'Hacking', status: 'upcoming', type: 'event' },
    { time: '09:30', endTime: '10:00', event: 'Desayuno', status: 'upcoming', type: 'break' },
    { time: '12:00', endTime: '13:00', event: 'Workshop: Usando Figma para el Hackathon', status: 'upcoming', type: 'workshop', url: '' },
    { time: '14:30', endTime: '15:30', event: 'Comida', status: 'upcoming', type: 'break' },
    { time: '17:00', endTime: '17:30', event: 'Sesion Grupal de Mentoring', status: 'upcoming', type: 'talk', url: '' },
  ],
  'Domingo': [
    { time: '00:00', endTime: '12:00', event: 'Hacking', status: 'upcoming', type: 'event' },
    { time: '12:00', endTime: '14:00', event: 'Presentaciones de proyectos', status: 'upcoming', type: 'talk', url: '' },
    { time: '14:00', endTime: '15:00', event: 'Deliberación del jurado', status: 'upcoming', type: 'break', url: '' },
    { time: '15:00', endTime: '16:00', event: 'Ceremonia de clausura y premios', status: 'upcoming', type: 'event', url: '' },
  ],
};

const StatusIcon = ({ status, className }: { status: ScheduleItem['status'], className?: string }) => {
  switch (status) {
    case 'upcoming':
      return <Clock className={className} />;
    case 'in-progress':
      return <PlayCircle className={className} />;
    case 'ended':
      return <CheckCircle className={className} />;
    default:
      return <HelpCircle className={className} />;
  }
};

const getStatusColor = (status: ScheduleItem['status'], isBlinking: boolean) => {
  switch (status) {
    case 'upcoming':
      return 'text-blue-400';
    case 'in-progress':
      return isBlinking ? 'text-red-300' : 'text-red-400';
    case 'ended':
      return 'text-red-400';
    default:
      return 'text-purple-400';
  }
};

const getTimeColor = (status: ScheduleItem['status']) => {
  switch (status) {
    case 'in-progress':
      return 'text-yellow-400';
    default:
      return 'text-green-400';
  }
};

const getStatusBgColor = (status: ScheduleItem['status']) => {
  switch (status) {
    case 'upcoming':
      return 'bg-sky-800';
    case 'in-progress':
      return 'bg-green-700';
    case 'ended':
      return 'bg-red-900';
    default:
      return 'bg-purple-900';
  }
};

const ScheduleComponent: React.FC = () => {
  const [activeDay, setActiveDay] = useState('Viernes');
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [isBlinking, setIsBlinking] = useState(false);
  const days = ['Viernes', 'Sábado', 'Domingo'];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const blinkTimer = setInterval(() => {
      setIsBlinking(prev => !prev);
    }, 800);
    return () => clearInterval(blinkTimer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
  };

  const isCurrentOrPast = (time: string, day: string) => {
    const [hours, minutes] = time.split(':').map(Number);
    const currentDate = new Date();
    const currentDay = currentDate.getDay();
    
    const dayMap: { [key: string]: number } = {
      'Viernes': 5,
      'Sábado': 6,
      'Domingo': 7
    };

    const eventDay = dayMap[day];
    
    if (currentDay !== eventDay) {
      return currentDay > eventDay || (currentDay === 0 && eventDay !== 0);
    }

    const currentHour = currentDate.getHours();
    const currentMinutes = currentDate.getMinutes();

    return currentHour > hours || (currentHour === hours && currentMinutes >= minutes);
  };

  const getTypeColor = (type: ScheduleItem['type']) => {
    switch (type) {
      case 'talk':
        return 'text-blue-300';
      case 'workshop':
        return 'text-yellow-300';
      case 'break':
        return 'text-red-300';
      case 'registration':
        return 'text-gray-200';
      default:
        return 'text-gray-300';
    }
  };

  const ItemContent = ({ item }: { item: ScheduleItem }) => (
    <div className="flex flex-col sm:flex-row items-start sm:items-center w-full transition-colors rounded-lg p-4">
      <span className={`text-base sm:text-xl font-bold mb-2 sm:mb-0 sm:mr-4 ${getTimeColor(item.status)}`}>
        {item.time} {item.endTime ? `- ${item.endTime}` : ''}
      </span>
      <div className="flex-grow mb-2 sm:mb-0">
        <h3 className="text-base sm:text-lg font-semibold text-white">{item.event}</h3>
        <span className={`text-sm ${getTypeColor(item.type)}`}>
          {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
        </span>
      </div>
      <div className="flex items-center">
        <StatusIcon 
          status={item.status} 
          className={`w-4 h-4 sm:w-6 sm:h-6 mr-2 ${getStatusColor(item.status, isBlinking)}`} 
        />
        <span className={`text-sm sm:text-base capitalize font-bold ${getStatusColor(item.status, isBlinking)}`}>
          {isCurrentOrPast(item.time, activeDay) ? 
            (item.time === formatTime(currentTime) ? 'En curso' : 'Finalizado') 
            : item.status.replace('-', ' ')}
        </span>
      </div>
    </div>
  );

  return (
    <div className="bg-black/60 backdrop-blur-sm rounded-lg p-4 sm:p-6">
      <div className="flex flex-wrap justify-center gap-2 sm:space-x-4 mb-6 sm:mb-8">
        {days.map((day) => (
          <button
            key={day}
            className={`px-4 sm:px-6 py-2 rounded-full text-sm sm:text-base font-bold transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 ${
              activeDay === day ? 'bg-violet-700 text-white' : 'bg-purple-200 text-purple-800 hover:bg-purple-300'
            }`}
            onClick={() => setActiveDay(day)}
          >
            {day}
          </button>
        ))}
      </div>

      <ul className="space-y-4">
        {schedule[activeDay].map((item, index) => (
          <li
            key={index}
            className={`rounded-lg transition-all ${
              getStatusBgColor(item.status)
            }`}
          >
            {item.type === 'registration' ? (
              <a href={item.url} target="_blank" rel="noopener noreferrer" className="block w-full">
                <ItemContent item={item} />
              </a>
            ) : (
              <ItemContent item={item} />
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ScheduleComponent;

