export const dynamic = "force-dynamic"; 

import { redirect } from "next/navigation";

import { getCurrent } from "@/features/auth/queries"

import PerformanceMetricsClient from "./client";

const PerformanceMetrics = async() => {
    const user = await getCurrent();

    if(!user){
        redirect('/sign-in')
    }

  return <PerformanceMetricsClient/>
}

export default PerformanceMetrics