import * as Icons from '@heroicons/react/24/outline';


const icons = [
    {
        name: 'rocket',
        icon: <Icons.RocketLaunchIcon className="h-6" color="purple"/> // Rockets are often silver or grey
    },
    {
        name: 'money',
        icon: <Icons.CurrencyDollarIcon className="h-6" color="green" fill='green' fillOpacity={0.2}/> // Money is traditionally green
    },
    {
        name: 'home',
        icon: <Icons.HomeIcon className="h-6" color="brown" fill='pink'/> // Homes often use brown to represent wood or bricks
    },
    {
        name: 'user',
        icon: <Icons.UserIcon className="h-6" color="blue" fill='cyan'/> // Blue can represent trust and dependability
    },
    {
        name: 'question',
        icon: <Icons.QuestionMarkCircleIcon className="h-6" color="purple"/> // Purple for mystery and uncertainty
    },
    {
        name: 'globe',
        icon: <Icons.GlobeAltIcon className="h-6" color="blue"/> // Blue for the oceans on a globe
    },
    {
        name: 'shopping',
        icon: <Icons.ShoppingCartIcon className="h-6" color="black" fill="lime"/> // Red to attract attention, like sales
    },
    {
        name: 'box',
        icon: <Icons.CubeIcon className="h-6" color="darkorange" fill='yellow'/> // Brown for cardboard
    },
    {
        name: 'truck',
        icon: <Icons.PaperAirplaneIcon className="h-6" color="black" fill="lightgray"/> // Black for the typical color of tires
    },
    {
        name: 'calendar',
        icon: <Icons.CalendarIcon className="h-6" color="blac" fill='red' fillOpacity={0.5}/> // Red for important dates
    },
    {
        name: 'food',
        icon: <Icons.CakeIcon className="h-6" color="purple"/> // Yellow for the color of cake
    },
    {
        name: 'video',
        icon: <Icons.FilmIcon className="h-6" color="gray"/> // Gray to represent old film reels
    },
    {
        name: 'camera',
        icon: <Icons.CameraIcon className="h-6" color="black"/> // Black for the common color of cameras
    },
    {
        name: 'book',
        icon: <Icons.BookOpenIcon className="h-6" color="maroon" fill='brown' fillOpacity={0.3}/> // Maroon for the classic book cover
    },
    {
        name: 'gift',
        icon: <Icons.GiftIcon className="h-6" color="red"/> // Red for excitement and celebration
    },
    {
        name: 'heart',
        icon: <Icons.HeartIcon className="h-6" color="black" fill='red'/> // Red for love and passion
    },
    {
        name: 'star',
        icon: <Icons.StarIcon className="h-6" color="purple" fill='gold'/> // Yellow for a bright star
    },
    {
        name: 'fire',
        icon: <Icons.FireIcon className="h-6" color="red" fill='orange'/> // Orange for flames
    },
    {
        name: 'lightning',
        icon: <Icons.BoltIcon className="h-6" color="orange"/> // Yellow for electricity
    },
    {
        name: 'sparkles',
        icon: <Icons.SparklesIcon className="h-6" color="purple" fill='cyan'/> // Yellow for sparkles
    },
    {
        name: 'store',
        icon: <Icons.BuildingStorefrontIcon className="h-6" color="black" fill='lime'/> // Green for the color of money
    }
]

export function getIconsByName (name: string) {
    let results = icons.filter(icon => icon.name === name)
    if (results.length === 0) return <Icons.QuestionMarkCircleIcon className="h-6" color="gray"/>
    return results[0].icon
}

export function nextIcon (current: string) {
    const index = icons.findIndex(icon => icon.name === current)
    return icons[(index + 1) % icons.length].name
}