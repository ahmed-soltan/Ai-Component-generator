import { redirect } from "next/navigation";

import { getCurrent } from "@/features/auth/queries"

import { PerformanceMetricsContainer } from "@/features/performance/components/performance-metrics-container";

const PerformanceMetrics = async() => {
    const user = await getCurrent();

    if(!user){
        redirect('/sign-in')
    }
  return <PerformanceMetricsContainer/>
}

export default PerformanceMetrics