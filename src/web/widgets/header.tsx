import { Outlet, useNavigate, useOutlet } from 'react-router'
import { Link } from 'react-router-dom';
import { HomePage } from '../pages/home';

const navigation = [
  { name: 'Transactions', href: '/transactions' },
  { name: 'Buckets', href: '/buckets' },
  { name: 'Filters', href: '/filters' },
  { name: 'Balances', href: '/balance' },
  { name: 'Settings', href: '/settings' },
]

export default function PageHeader () {

    const page = useNavigate();
    const currentPath = window.location.pathname;

    const NavElements = navigation.map((item) => {
        const isActive = currentPath === item.href;
        const className = isActive ? 'bg-gradient-to-r from-pink-600 via-indigo-500 to-cyan-400 inline-block text-transparent bg-clip-text' : 'hover:bg-gray-200 rounded';
        return (
            <Link  key={item.name} 
                className={`${className} font-semibold px-2 py-1 text-sm font-medium`} 
                to={item.href}>

                {item.name}
            </Link>
        )
    })

    const outlet = useOutlet()

    return (
        <>
            <header className="bg-white">
                <nav className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8" aria-label="Global">
                    <div className="flex lg:flex-1">
                        <a className="-m-1.5 p-1.5 flex gap-4 cursor-pointer" onClick={() => page('/')}>
                            <img className="h-8 w-auto" src="/logo.png" alt="" />
                            <div className='text-xl font-bold translate-y-0.5 bg-gradient-to-r from-pink-600 via-indigo-500 to-cyan-400 inline-block text-transparent bg-clip-text'>
                                Zynith  
                            </div>
                        </a>
                    </div>
                    <div className="flex gap-x-4">
                        {NavElements}
                    </div>
                </nav>
                <div className='max-w-6xl mx-auto mb-20'>
                    {
                        outlet && <Outlet />
                    }
                    {
                        !outlet && <HomePage />
                    }
                </div>
            </header>
        </>
    )
}
