import React, { useState } from 'react';
import { Button } from '../ui/button';
import { LogOut, User2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { USER_API_END_POINT } from '@/utils/constant';
import { setUser } from '@/redux/authSlice';
import { toast } from 'sonner';

const Navbar = () => {
    const { user } = useSelector(store => store.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const logoutHandler = async () => {
        try {
            const res = await axios.get(`${USER_API_END_POINT}/logout`, { withCredentials: true });
            if (res.data.success) {
                dispatch(setUser(null));
                navigate("/");
                toast.success(res.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message);
        }
    };

    // Extract the first letter of the user's name
    const firstLetter = user?.fullname?.charAt(0).toUpperCase();

    return (
        <div className="bg-white">
            <div className="flex items-center justify-between mx-auto max-w-7xl h-16">
                <div>
                    <h1 className="text-2xl font-bold">
                        Job<span className="text-[#F83002]">Portal</span>
                    </h1>
                </div>
                <div className="flex items-center gap-12">
                    <ul className="flex font-medium items-center gap-5">
                        {user && user.role === 'recruiter' ? (
                            <>
                                <li><Link to="/admin/companies">Companies</Link></li>
                                <li><Link to="/admin/jobs">Jobs</Link></li>
                            </>
                        ) : (
                            <>
                                <li><Link to="/">Home</Link></li>
                                <li><Link to="/jobs">Jobs</Link></li>
                                <li><Link to="/browse">Browse</Link></li>
                            </>
                        )}
                    </ul>
                    {!user ? (
                        <div className="flex items-center gap-2">
                            <Link to="/login"><Button variant="outline">Login</Button></Link>
                            <Link to="/signup"><Button className="bg-[#6A38C2] hover:bg-[#5b30a6]">Signup</Button></Link>
                        </div>
                    ) : (
                        <div className="relative">
                            <div
                                onClick={() => setDropdownOpen(!dropdownOpen)}
                                className="cursor-pointer flex items-center"
                            >
                                {/* Circle with the first letter of the user's name */}
                                <div className="w-8 h-8 flex items-center justify-center bg-blue-600 text-white rounded-full">
                                    {firstLetter}
                                </div>
                            </div>
                            {dropdownOpen && (
                                <div className="absolute right-0 mt-2 w-80 bg-yellow-200 border border-red-500 rounded-md shadow-lg p-4 z-10">
                                    <div className="flex gap-2 items-center">
                                        {/* Circle with the first letter of the user's name */}
                                        <div className="w-8 h-8 flex items-center justify-center bg-blue-600 text-white rounded-full">
                                            {firstLetter}
                                        </div>
                                        <div>
                                            <h4 className="font-medium">{user?.fullname || 'Santoshini'}</h4>
                                            <p className="text-sm text-muted-foreground">{user?.profile?.bio}</p>
                                        </div>
                                    </div>
                                    <div className="flex flex-col mt-4 text-gray-600">
                                        {user && user.role === 'student' && (
                                            <div className="flex items-center gap-2 cursor-pointer">
                                                <User2 />
                                                <Link to="/profile" className="text-blue-600 hover:underline">View Profile</Link>
                                            </div>
                                        )}
                                        <div className="flex items-center gap-2 cursor-pointer mt-2" onClick={logoutHandler}>
                                            <LogOut />
                                            <button className="text-blue-600 hover:underline">Logout</button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Navbar;

