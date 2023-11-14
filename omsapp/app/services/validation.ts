// [{"assignmentFinishDate": "2023-09-23T00:00:00", "assignmentFinishTime": "23:00", 
//"assignmentStartDate": "2023-09-23T00:00:00", "assignmentStartTime": "23:00", 
//"busId": "B0001", "routeId": 14}]


export const startTime = (startDate : string, startTime: string, endDate : string, endTime: string) => {
    const start = new Date(startDate.split("T")[0] + "T"+ startTime)
    const end = new Date(endDate.split("T")[0] + "T"+ endTime);
    const now =  new Date();
    if (start < now && now < end ) {
        return(true)
      } else {
        return (false)  
      } 
}

export const endTime = (endDate : string, endTime: string) => {
    const date = new Date(endDate.split("T")[0] + "T"+ endTime)
    const now =  new Date();
    if (date > now || date == now) {
        return(false)
      } else {
        return (true)
      } 
}