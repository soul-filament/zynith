import * as Icons from '@heroicons/react/20/solid';
import { useState } from 'react';

const icons = [
    {
        name: 'money',
        icon: <Icons.CurrencyDollarIcon className="h-6" color="green"  fillOpacity={0.8} stroke='black' strokeWidth={0.5} /> 
    },
    {
        name: 'card',
        icon: <Icons.CreditCardIcon className="h-6" color="green"  fillOpacity={0.8} stroke='black' strokeWidth={0.5} />
    },
    {
        name: 'store',
        icon: <Icons.BuildingOffice2Icon className="h-6" color="green" fillOpacity={0.8} stroke='black' strokeWidth={0.5} />
    },
    {
        name: 'home',
        icon: <Icons.HomeIcon className="h-6" color="green"  fillOpacity={0.8} stroke='black' strokeWidth={0.5} /> 
    },
    {
        name: 'rocket',
        icon: <Icons.RocketLaunchIcon className="h-6" color="darkorange" fillOpacity={0.8} stroke='black' strokeWidth={0.5} /> 
    },
    {
        name: 'box',
        icon: <Icons.CubeIcon className="h-6" color="darkorange"  fillOpacity={0.8} stroke='black' strokeWidth={0.5} /> 
    },
    {
        name: 'star',
        icon: <Icons.StarIcon className="h-6" color="darkorange" fillOpacity={0.8} stroke='black' strokeWidth={0.5} />
    },
    {
        name: 'fire',
        icon: <Icons.FireIcon className="h-6" color="darkorange" fillOpacity={0.8} stroke='black' strokeWidth={0.5} />
    },
    {
        name: 'user',
        icon: <Icons.UserIcon className="h-6" color="blue"  fillOpacity={0.8} stroke='black' strokeWidth={0.5} /> 
    },
    {
        name: 'globe',
        icon: <Icons.GlobeAltIcon className="h-6" color="blue"  fillOpacity={0.8} stroke='black' strokeWidth={0.5} /> 
    },
    {
        name: 'plane',
        icon: <Icons.PaperAirplaneIcon className="h-6" color="blue" fillOpacity={0.8} stroke='black' strokeWidth={0.5} /> 
    },
    {
        name: 'lightning',
        icon: <Icons.BoltIcon className="h-6" color="blue" fillOpacity={0.8} stroke='black' strokeWidth={0.5} />
    },
    {
        name: 'shopping',
        icon: <Icons.ShoppingCartIcon className="h-6" color="red" fillOpacity={0.8} stroke='black' strokeWidth={0.5} /> 
    },
    {
        name: 'calendar',
        icon: <Icons.CalendarIcon className="h-6" color="red" fillOpacity={0.8} stroke='black' strokeWidth={0.5} /> 
    },
    {
        name: 'gift',
        icon: <Icons.GiftIcon className="h-6" color="red" fillOpacity={0.8} stroke='black' strokeWidth={0.5} /> 
    },
    {
        name: 'heart',
        icon: <Icons.HeartIcon className="h-6" color="red" fillOpacity={0.8} stroke='black' strokeWidth={0.5} />
    },
    {
        name: 'food',
        icon: <Icons.CakeIcon className="h-6" color="darkcyan" fillOpacity={0.8} stroke='black' strokeWidth={0.5} /> 
    },
    {
        name: 'video',
        icon: <Icons.FilmIcon className="h-6" color="darkcyan" fillOpacity={0.8} stroke='black' strokeWidth={0.5} /> 
    },
    {
        name: 'camera',
        icon: <Icons.CameraIcon className="h-6" color="darkcyan" fillOpacity={0.8} stroke='black' strokeWidth={0.5} /> 
    },
    {
        name: 'book',
        icon: <Icons.BookOpenIcon className="h-6" color="darkcyan" fillOpacity={0.8} stroke='black' strokeWidth={0.5} />
    }
]


export function DeleteButton ({ onClick }: { onClick: () => void }) {
    return (
        <div className='hover:text-red-500 cursor-pointer flex' onClick={(e) => {
            onClick()
            e.stopPropagation()
        }}>
            <Icons.XMarkIcon className="h-6" color="red" />
        </div>
    )
}

interface IconProps {
    name: string
}

export function Icon ({ name }: IconProps) {
    let results = icons.filter(icon => icon.name === name)
    if (results.length === 0) return <Icons.QuestionMarkCircleIcon className="h-6" color="gray"/>
    return results[0].icon
}

interface IconPickerProps {
    onChange: (icon: string) => void
    selectedIcon: string
}

export function IconPicker ({ onChange, selectedIcon }: IconPickerProps) {

    const [open, setOpen] = useState(false)
    const openPicker = (
        icons.map(icon => {
            return (
                <div className="p-2" onClick={() => onChange(icon.name)}>
                    <div className={`rounded-full p-2 cursor-pointer ${selectedIcon === icon.name ? 'bg-gray-200' : ''}`}>
                        {icon.icon}
                    </div>
                </div>
            )
        })
    )

    return (
        <div className="flex flex-wrap cursor-pointer" onClick={() => setOpen(!open)}>
            {
                open && <div className='absolute z-10 bg-white rounded-md shadow-lg w-[230px] flex flex-wrap border'>
                    {openPicker}
                </div>
            }
            <Icon name={selectedIcon} />
        </div>
    )
}