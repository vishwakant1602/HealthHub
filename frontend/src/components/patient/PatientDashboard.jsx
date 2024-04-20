import React from 'react'
import {Tabs,TabsHeader,Tab,} from "@material-tailwind/react";
import { NavLink, Outlet } from 'react-router-dom';

const PatientDashboard = () => {
    return (
        <div className=' bg-blue-gray-100 h-[100vh] w-full p-5'>

            <h1 className='text-3xl font-mono font-bold leading-loose'>Patient Dashboard</h1>

            <div >
                <Tabs value="df">
                    <TabsHeader className="lg:w-[80vw] w-full lg:ml-[10vw] ml-[0vw]  mt-[5vh]">


                        <NavLink to={"/patient/profile"} className="flex items-center hover:text-black hover:font-bold transition-colors w-[25vw] lg:w-[20vw]">
                            <Tab value={"Profile"}>Profile</Tab>
                        </NavLink>



                        <NavLink to={"/patient/info"} className="flex items-center hover:text-black hover:font-bold transition-colors w-[25vw] lg:w-[20vw]">
                            <Tab value={"Information"}>Information </Tab>
                        </NavLink>



                        <NavLink to={"/patient/appointments"} className="flex items-center hover:text-black hover:font-bold transition-colors w-[25vw] lg:w-[20vw]">
                            <Tab value={"Appointments"}>Appointments</Tab>
                        </NavLink>



                        <NavLink to={"/patient/stats"} className="flex items-center hover:text-black hover:font-bold  transition-colors w-[25vw] lg:w-[20vw]">
                            <Tab value={"Stats"}>Stats</Tab>
                        </NavLink>

                    </TabsHeader>
                </Tabs>
            </div>

            <div className='h-[70vh] lg:w-[80vw] w-full  ml-[0vw] lg:ml-[10vw] mt-[5vh] overflow-y-scroll bg-red-200 patient-outlet  rounded-xl'>
                <Outlet></Outlet>
            </div>

        </div>
    )
}

export default PatientDashboard