import React from 'react';
import { Button } from "@/components/ui/button"

const Header: React.FC = () => {
    return (
        <header className="flex justify-between items-center px-3 py-5">
            <h1 className="text-2xl text-black">Splitmytrip</h1>
            <div className='flex gap-4'>
                <Button>
                    Register
                </Button>
                <Button>
                    Login
                </Button>
            </div>
        </header>
    );
};

export default Header;
