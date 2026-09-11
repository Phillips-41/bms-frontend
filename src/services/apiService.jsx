import axios from "axios";
import { getUsername } from "../utils/ProtectedRoutes";

const BASE_URL = "https://rbms.mahadiscom.in/mseb"; 
// const BASE_URL = "https://rbms.mahadiscom.in/mseb";
export const API_KEY = "AIzaSyCHaONrQ1KYNXbtSRFNNSWETwrQaJY_B0U"

// Create an Axios instance with default configuration
const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Handle token expiration (401 Unauthorized)
      if (error.response.status === 401) {
        // Clear the expired token
        sessionStorage.removeItem("token");
        
        // Redirect to login page
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

// Add JWT token to every request via interceptor
apiClient.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const fetchAllSiteIds = async () => {
  try {
    const response = await apiClient.get("/getAllSiteIdAndSerialNumbers");
    return response.data;
  } catch (error) {
    console.error("Error fetching site data:", error);
    throw error;
  }
};

export const fetchCommunicationStatus = async (marginMinutes) => {
  try {
    const response = await apiClient.get("/getCommnStatus", {
      params: { marginMinutes ,'username':getUsername(sessionStorage.getItem("token")) },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching communication status:", error);
    throw error;
  }
};

export const fetchLatestData = async () => {
  try {
    const response = await apiClient.get("/latest");
    return response.data;
  } catch (error) {
    console.error("Error fetching communication status:", error);
    throw error;
  }
};


export const fetchCommunicationDevices = async (marginMinutes) => {
  try {
    const response = await apiClient.get("/communicationStatus");
    return response.data;
  } catch (error) {
    console.error("Error fetching communication status:", error);
    throw error;
  }
};

export const fetchManufacturerDetails = async (area) => {
  try {
    const response = await apiClient.get(
      `/getManufacturerDetailsBySiteIdAndSerialNumber?area=${area} `
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching manufacturer details:", error);
    throw error;
  }
};

export const fetchDeviceDetails = async (area) => {
  try {
    const response = await apiClient.get(
      `/getGeneralDataBySiteIdAndSerialNumber?area=${area}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching device details:", error);
    throw error;
  }
};
// export const fetchHistoricalBatteryandChargerdetails =async (serialNumber,siteId,strStartDate,strEndDate,page,size)=>{
//   try{
//     const response =await apiClient.get(
//       `${BASE_URL}/getHistoricalStringDataBySiteidAndSerialNumberBetweenDateswithPg?page=${page}&size=${size}&sort=serverTime,desc&siteId=${siteId}&serialNumber=${serialNumber}&strStartDate=${strStartDate}&strEndDate=${strEndDate}`
//     );
//     return response.data;
//   }
//   catch(error){
//     console.error("Error fetching Historical String details",error);
//     throw error;
//   }

// }

export const fetchHistoricalBatteryandChargerdetails =async (area,strStartDate,strEndDate,page,size)=>{
  try{
    const response =await apiClient.get(
      `${BASE_URL}/getHistoricalStringDataBySiteidAndSerialNumberBetweenDateswithPg?page=${page}&size=${size}&sort=serverTime,desc&area=${area}&strStartDate=${strStartDate}&strEndDate=${strEndDate}`
    );
    return response.data;
  }
  catch(error){
    console.error("Error fetching Historical String details",error);
    throw error;
  }

}
  export const fetchHistoricalCelldetails =async (area,strStartDate,strEndDate,page,size)=>{
    try{
      const response =await apiClient.get(
        `${BASE_URL}/getHistoricalCellDataBySiteidAndSerialNumberBetweenDateswithPg?page=${page}&size=${size}&sort=serverTime,desc&area=${area}&strStartDate=${strStartDate}&strEndDate=${strEndDate}`
      );
      return response.data;
    }
    catch(error){
      console.error("Error fetching Historical String details",error);
      throw error;
    }
  
    }

    export const fetchCircleWiseData =async (cirlcle)=>{
    try{
      const response =await apiClient.get(
        `${BASE_URL}/getCircleWise?circleName=${cirlcle}`);
      return response.data;
    }
    catch(error){
      console.error("Error fetching Historical String details",error);
      throw error;
    }
  }

      export const fetchDivisionWiseData =async (division)=>{
    try{
      const response =await apiClient.get(
        `${BASE_URL}/getDivisionWise?divisionName=${division}`);
      return response.data;
    }
    catch(error){
      console.error("Error fetching Historical String details",error);
      throw error;
    }
  
    }
    export const fetchHistoricalCellAlarms = async(area, strStartDate,strEndDate,page,size)=>{
      try{
        const response = await apiClient.get(`${BASE_URL}/getHistoricalCellAlarms?page=${page}&size=${size}&sort=serverTime,desc&area=${area}&strStartDate=${strStartDate}&strEndDate=${strEndDate}`);
        return response.data;
      } catch(error){
        console.log("Error fetching Historical Cell Alarams", error);
        throw error;
      }
    }
    export const downloadHistoricalCells=async(area,strStartDate,strEndDate)=>{
   
      try {
        // Construct the query parameters
        const params = {
            area,
            strStartDate,
            strEndDate,
        };
  
        // Make a GET request to the backend endpoint using Axios
        const response = await apiClient.get(`${BASE_URL}/downloadHistoricalCellsReport`, {
            params, // Pass query parameters
            responseType: 'blob', // Ensure the response is treated as a Blob (binary data)
        });
  
        // Create a temporary URL for the Blob
        const url = window.URL.createObjectURL(new Blob([response.data]));
  
        // Create a temporary anchor element to trigger the download
        const a = document.createElement('a');
        a.href = url;
        a.download = `HistoricalCellReport_${area}_${strStartDate}&${strEndDate}.xls`; // Set the file name
        document.body.appendChild(a); // Append the anchor to the DOM
        a.click(); // Programmatically click the anchor to trigger the download
  
        // Clean up
        window.URL.revokeObjectURL(url); // Release the object URL
        document.body.removeChild(a); // Remove the anchor from the DOM
    } catch (error) {
        console.error('Error downloading the Excel file:', error);
    }
  
    }
  export const downloadHistoricalBatteryandChargerdetails=async(area,strStartDate,strEndDate)=>{
   
    try {
      // Construct the query parameters
      const params = {
          area,
          strStartDate,
          strEndDate,
      };

      // Make a GET request to the backend endpoint using Axios
      const response = await apiClient.get(`${BASE_URL}/downloadHistoricalStringReport`, {
          params, // Pass query parameters
          responseType: 'blob', // Ensure the response is treated as a Blob (binary data)
      });

      // Create a temporary URL for the Blob
      const url = window.URL.createObjectURL(new Blob([response.data]));

      // Create a temporary anchor element to trigger the download
      const a = document.createElement('a');
      a.href = url;
      a.download = `HistoricalStringReport_${area}_${strStartDate}&${strEndDate}.xls`; // Set the file name
      document.body.appendChild(a); // Append the anchor to the DOM
      a.click(); // Programmatically click the anchor to trigger the download

      // Clean up
      window.URL.revokeObjectURL(url); // Release the object URL
      document.body.removeChild(a); // Remove the anchor from the DOM
  } catch (error) {
      console.error('Error downloading the Excel file:', error);
  }
  }
  export const downloadDayWiseBatteryandChargerdetails=async(area,strStartDate,strEndDate)=>{
  
    try {
      // Construct the query parameters
      const params = {
          area,
          strStartDate,
          strEndDate,
      };

      // Make a GET request to the backend endpoint using Axios
      const response = await apiClient.get(`${BASE_URL}/downloadDaywiseReports`, {
          params, // Pass query parameters
          responseType: 'blob', // Ensure the response is treated as a Blob (binary data)
      });

       const blob = new Blob([response.data], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
       });

    const url = window.URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `HistoricalStringReport_${area}_${strStartDate}&${strEndDate}.xls`;
    document.body.appendChild(a);
    a.click();

    // Cleanup
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  } catch (error) {
      console.error('Error downloading the Excel file:', error);
  }
    }
      export const downloadBatteryandChargerdetails=async(siteId,serialNumber,strStartDate,strEndDate)=>{
  
    try {
      // Construct the query parameters
      const params = {
          siteId,
          serialNumber,
          strStartDate,
          strEndDate,
      };

      // Make a GET request to the backend endpoint using Axios
      const response = await apiClient.get(`${BASE_URL}/downloadFullReport`, {
          params, // Pass query parameters
          responseType: 'blob', // Ensure the response is treated as a Blob (binary data)
      });

       const blob = new Blob([response.data], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
       });

    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `HistoricalStringReport_${siteId}_${serialNumber}_${strStartDate}&${strEndDate}.xlsx`;
    document.body.appendChild(a);
    a.click();

    // Cleanup
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  } catch (error) {
      console.error('Error downloading the Excel file:', error);
  }
    }
    export const downloadMonthWiseBatteryandChargerdetails=async(area,year,month)=>{
  
      try {
        // Construct the query parameters
        const params = {
            area,
            year,
            month,
        };
  
        // Make a GET request to the backend endpoint using Axios
        const response = await apiClient.get(`${BASE_URL}/downloadMonthlyReports`, {
            params, // Pass query parameters
            responseType: 'blob', // Ensure the response is treated as a Blob (binary data)
        });
  
        // Create a temporary URL for the Blob
        const url = window.URL.createObjectURL(new Blob([response.data]));
  
        // Create a temporary anchor element to trigger the download
        const a = document.createElement('a');
        a.href = url;
        a.download = `MonthWiseReport_${area}_${year}&${month}.xls`; // Set the file name
        document.body.appendChild(a); // Append the anchor to the DOM
        a.click(); // Programmatically click the anchor to trigger the download
  
        // Clean up
        window.URL.revokeObjectURL(url); // Release the object URL
        document.body.removeChild(a); // Remove the anchor from the DOM
    } catch (error) {
        console.error('Error downloading the Excel file:', error);
    }
      }




    export const downloadBatteryAlarms=async(area,strStartDate,strEndDate)=>{

      try {
        // Construct the query parameters
        const params = {
            area,
            strStartDate,
            strEndDate,
        };
  
        // Make a GET request to the backend endpoint using Axios
        const response = await apiClient.get(`${BASE_URL}/downloadHistoricalAlarmsReport`, {
            params, // Pass query parameters
            responseType: 'blob', // Ensure the response is treated as a Blob (binary data)
        });
  
        // Create a temporary URL for the Blob
        const url = window.URL.createObjectURL(new Blob([response.data]));
  
        // Create a temporary anchor element to trigger the download
        const a = document.createElement('a');
        a.href = url;
        a.download = `AlarmsReport_${area}&${strEndDate}.xls`; // Set the file name
        document.body.appendChild(a); // Append the anchor to the DOM
        a.click(); // Programmatically click the anchor to trigger the download
  
        // Clean up
        window.URL.revokeObjectURL(url); // Release the object URL
        document.body.removeChild(a); // Remove the anchor from the DOM
    } catch (error) {
        console.error('Error downloading the Excel file:', error);
    }
  
      }

  export const fetchDaywiseBatteryandChargerdetails =async (area,strStartDate,strEndDate,page,size)=>{
    try{
      const response =await apiClient.get(
        `${BASE_URL}/getDaywiseReports?area=${area}&strStartDate=${strStartDate}&strEndDate=${strEndDate}&page=${page}&size=${size}`
      );
      return response.data;
    }
    catch(error){
      console.error("Error fetching Daywise String details",error);
      throw error;
    }
     
  }
  export const fetchCycleData=async(siteId,serialNumber,date)=>{
    try{
      const response = await apiClient.get(`${BASE_URL}/getDaywiseCycleReports?siteId=${siteId}&serialNumber=${serialNumber}&date=${date}`);
      return response.data;
    }
    catch(error){
      console.error("Error fetching Daywise String details",error);
      throw error;
    }
  }

export const fetchAlarmsBatteryandChargerdetails = async (
  area,
  strStartDate,
  strEndDate,page,rowsPerPage
) => {
  try {
    const response = await apiClient.get(
      `/getHistoricalAlarmsDataBySiteidAndSerialNumberBetweenDateswithPg?area=${area}&strStartDate=${strStartDate}&strEndDate=${strEndDate}&page=${page}&size=${rowsPerPage}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching Alarms String details:", error);
    throw error;
  }
};

export const fetchMonthlyBatteryandChargerdetails = async (
  area,
  year,
  month
) => {
  try {
    const response = await apiClient.get(
      `/getMonthlyReports?area=${area}&year=${year}&month=${month}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching Monthly String details:", error);
    throw error;
  }
};

export const fetchSiteDetailsBatteryandChargerdetails = async (
  siteId,
  serialNumber
) => {
  try {
    const response = await apiClient.get("/api/location", {
      params: { siteId, serialNumber },
    });
  
    return response.data;
  } catch (error) {
    console.error("Error in fetching site details: ", error);
    throw error;
  }
};

export const addSiteLocation = async (siteId, formData) => {
  try {
  
    const payload = {
      siteId: siteId,
      SiteLocationDTO: JSON.stringify(formData),
    };

    const response = await apiClient.post("/api/postAddNewLocationToSiteId", payload);
  
    return response.data;
  } catch (error) {
    console.error("Error while adding new site location:", error);
    throw error;
  }
};

export const updateSiteLocation = async (siteLocation) => {
  try {
    const payload = {
      SiteLocationDTO: siteLocation,
    };
    const response = await apiClient.put("/api/updateSiteLocationToSiteId", payload);
  
    return response.data;
  } catch (error) {
    console.error("Error updating site location: ", error);
    throw error;
  }
};

export const deleteSite = async (siteId, serialNumber) => {
  try {
    const response = await apiClient.delete("/api/deleteSiteLocationToSiteId", {
      params: { siteId, serialNumber },
    });

    return response.data;
  } catch (error) {
    console.error("Error deleting site:", error);
    throw error;
  }
};

export const fetchManfacurareDetailsBatteryandChargerdetails = async () => {
  try {
    const response = await apiClient.get("/getAllManufacturerDetails");

    return response.data;
  } catch (error) {
    console.error("Error in fetching manufacturer details: ", error);
    throw error;
  }
};

export const ManufacturerDeleteSite = async (siteId, serialNumber) => {
  try {
    const api = "/deleteManufacturerDetailsBySiteIdAndSerialNumber";

    const response = await apiClient.delete(api, {
      params: { siteId, serialNumber },
    });
 
    return response.data;
  } catch (error) {
    console.error("Error in ManufacturerDeleteSite API call:", error.response || error.message || error);
    throw error;
  }
};

export const fetchStatesDetails = async () => {
  try {
    const response = await apiClient.get("/api/states");
 
    return response.data;
  } catch (error) {
    console.error("Error in fetching states details: ", error);
    throw error;
  }
};

export const fetchCirclesDetails = async () => {
  try {
    const response = await apiClient.get("/api/circles");
   
    return response.data;
  } catch (error) {
    console.error("Error in fetching circles details: ", error);
    throw error;
  }
};

export const fetchAreasDetails = async () => {
  try {
    const response = await apiClient.get("/api/areas");

    return response.data;
  } catch (error) {
    console.error("Error in fetching areas details: ", error);
    throw error;
  }
};

export const fetchLoginRoles = async () => {
  try {
    const response = await apiClient.get("/getListofLoginRoles");
   
    return response.data;
  } catch (error) {
    console.error("Error in fetching roles details: ", error);
    throw error;
  }
};

export const fetchMapBySite = async (siteId,serialNumber) => {
  try {
    const response = await apiClient.get(`/api/getCoordinates?siteId=${siteId}&serialNumber=${serialNumber}&marginMinutes=240`);
    return response.data;
  } catch (error) {
    console.error("Error in fetching Map details: ", error);
    throw error;
  }
};

export const fetchMapByState = async (state,username) => {
  try {
    const response = await apiClient.get(`/api/getCoordinates/newStates?state=${state}&marginMinutes=60&username=${getUsername(sessionStorage.getItem("token"))}`);
    return response.data;
  } catch (error) {
    console.error("Error in fetching Map details: ", error);
    throw error;
  }
};

export const fetchMapByZone = async (zone,username) => {
  try {
    const response = await apiClient.get(`/api/getCoordinates/newZones?zone=${zone}&marginMinutes=60&username=${username}`);
    return response.data;
  } catch (error) {
    console.error("Error in fetching Map details: ", error);
    throw error;
  }
};

export const fetchCircleNames = async (zone)=>{
  try {
    const response = await apiClient.get(`/getUserCircles?zoneName=${zone}`);
    return response.data;
  } catch (error) {
    console.error("Error in fetching Circle names: ", error);
    throw error;
  }
}
export const fetchZoneNames = async (stateName)=>{
  try {
    const response = await apiClient.get(`/getUserZones?stateName=${stateName}`);
    return response.data;
  } catch (error) {
    console.error("Error in fetching Circle names: ", error);
    throw error;
  }
}

export const fetchAreaList = async (division)=>{
  try{
    const response = await apiClient.get(`/getUserAreas?divisionName=${division}`);
    return response.data;
  } catch (error) {
    throw error;
  }
}

export const fetchDivisionList = async (circle)=>{
  try{
    const response = await apiClient.get(`/getUserDivisions?circleName=${circle}`);
    return response.data;
  } catch (error) {
    throw error;
  }
}

export const fetchAllCircles = async (zone)=>{
  try {
    const response = await apiClient.get(`/api/circles?zone=${zone}`);
    return response.data;
  } catch (error) {
    console.error("Error in fetching Circle names: ", error);
    throw error;
  }
}


export const fetchAllDivisions = async (circle)=>{
  try {
    const response = await apiClient.get(`/api/divisions?circle=${circle}`);
    return response.data;
  } catch (error) {
    console.error("Error in fetching Circle names: ", error);
    throw error;
  }
}

export const fetchAllCirclesWithStates = async (state)=>{
  try {
    const response = await apiClient.get(`/api/state/circles?state=${state}`);
    return response.data;
  } catch (error) {
    console.error("Error in fetching Circle names: ", error);
    throw error;
  }
}

export const fetchAllZones = async (state)=>{
  try {
    const response = await apiClient.get(`/api/zones?state=${state}`);
    return response.data;
  } catch (error) {
    console.error("Error in fetching Circle names: ", error);
    throw error;
  }
}


export const fetchAreaNames = async (division)=>{
  try {
    const response = await apiClient.get(`/api/areas?division=${division}`);
    return response.data;
  } catch (error) {
    console.error("Error in fetching areas names: ", error);
    throw error;
  }
}
export const fetchMapByCircle = async (circle) => {
  try {
    const response = await apiClient.get(`/api/getCoordinates/newCircle?circle=${circle}&marginMinutes=60`);
    return response.data;
  } catch (error) {
    console.error("Error in fetching Map details: ", error);
    throw error;
  }
};

export const fetchMapByDivision = async (division) => {
  try {
    const response = await apiClient.get(`/api/getCoordinates/newDivision?circle=${division}`);
    return response.data;
  } catch (error) {
    console.error("Error in fetching Map details: ", error);
    throw error;
  }
};
export const fetchIdsByCircle = async (circle)=>{
  try {
    const response = await apiClient.get(`/api/ids?circle=${circle}`);
    return response.data;
  } catch (error) {
    console.error("Error in fetching Site IDs by Circle: ", error);
    throw error;
  }
}

export const fetchMapByArea = async (area) => {
  try {
    const response = await apiClient.get(`/api/getCoordinates/area?area=${area}&marginMinutes=60`);
    return response.data;
  } catch (error) {
    console.error("Error in fetching Map details: ", error);
    throw error;
  }
};

export const fetchUserDetails = async () => {
  try {
    const response = await apiClient.get(`${BASE_URL}/AllUsers`);
    return response.data;
  } catch (error) {
    console.error("Error in fetching login details: ", error);
    throw error;
  }
};

export const fetchZoneCircleDetails = async () => {
  try {
    const response = await apiClient.get(`${BASE_URL}/zone-circle-counts`);
    return response.data;
  } catch (error) {
    console.error("Error in fetching login details: ", error);
    throw error;
  }
};
export const deleteUser = async (id) => {
  try {
    const response = await apiClient.delete(`${BASE_URL}/DeleteLoginUserByLoginCredId?loginCredId=${id}`);
    return response.data;
  } catch (error) {
    console.error("Error in deleting user details: ", error);
    throw error;
  }
};
export const PostUser = async (userData) => {
  try {
    const response = await apiClient.post(`${BASE_URL}/PostCreateNewLoginUser`, userData);
    return response.data;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};

// Update an existing user
export const UpdateUser = async (userData) => {
  try {
    const response = await apiClient.post(`${BASE_URL}/PostUpdateLoginUser`, userData);
    return response.data;
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
};

export const Updatesite = async () => {
  try {
    const response = await apiClient.put(`${BASE_URL}/api/updateSiteLocationToSiteId`, combinedData);
    return response.data;
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
};

export const fetchCellVT = async (siteId,serialNumber,cellNumber,startDateTime,endDateTime) => {
  try {
    const response = await apiClient.get(`${BASE_URL}/getSpecificCellDataBySiteIdAndSerialNumberBetweenDates?siteId=${siteId}&serialNumber=${serialNumber}&cellNumber=${cellNumber}&strStartDate=${encodeURIComponent(startDateTime)}&strEndDate=${encodeURIComponent(endDateTime)}`);
    return response.data;
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
}
export const downloadCellVTDetails=async(siteId,serialNumber,cellNumber,strStartDate,strEndDate)=>{
  
  try {
    // Construct the query parameters
    const params = {
        siteId,
        serialNumber,
        cellNumber,
        strStartDate,
        strEndDate,
    };

    // Make a GET request to the backend endpoint using Axios
    const response = await apiClient.get(`${BASE_URL}/downloadCellDataReport`, {
        params, // Pass query parameters
        responseType: 'blob', // Ensure the response is treated as a Blob (binary data)
    });

    // Create a temporary URL for the Blob
    const url = window.URL.createObjectURL(new Blob([response.data]));

    // Create a temporary anchor element to trigger the download
    const a = document.createElement('a');
    a.href = url;
    a.download = `Cell${cellNumber}_${strStartDate}.xls`; // Set the file name
    document.body.appendChild(a); // Append the anchor to the DOM
    a.click(); // Programmatically click the anchor to trigger the download

    // Clean up
    window.URL.revokeObjectURL(url); // Release the object URL
    document.body.removeChild(a); // Remove the anchor from the DOM
} catch (error) {
    console.error('Error downloading the Excel file:', error);
}

  }


export const getCoordinates = async (siteId) => {
  try {
    const response = await apiClient.get(`${BASE_URL}/api/getCoordinates`, {
      params: { siteId, marginMinutes: 15 },
    });
    return response.data;
  } catch (error) {
    console.error('Failed to fetch coordinates:', error);
    throw error;
  }
}
export const sendMasterFile = async (formData) => {
  try {
    const response = await apiClient.post(`${BASE_URL}/api/sites/upload-and-save`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error in sending master file:', error);
    throw error;
  }
};

export const downloadTemplate = async () => {
  try {
    const response = await apiClient.get(`${BASE_URL}/api/sites/template`, {
      responseType: 'blob',
    });

    // Get the binary data
    const blobData = response.data;

    // Get the MIME type from the response headers
    const contentType = response.headers['content-type'] || 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';

    // Determine the file extension based on the MIME type
    let fileExtension = '.xlsx';
    if (contentType.includes('application/vnd.ms-excel')) {
      fileExtension = '.xls';
    } else if (contentType.includes('text/csv')) {
      fileExtension = '.csv';
    }

    // Extract filename from Content-Disposition header, if available
    let filename = `MasterFile_Template${fileExtension}`;
    const contentDisposition = response.headers['content-disposition'];
    if (contentDisposition) {
      const filenameMatch = contentDisposition.match(/filename="(.+)"/);
      if (filenameMatch && filenameMatch[1]) {
        filename = filenameMatch[1];
      }
    }

    // Create the blob with the correct MIME type
    const blob = new Blob([blobData], { type: contentType });

    // Create download link
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;

    // Trigger download
    document.body.appendChild(a);
    a.click();

    // Cleanup
    setTimeout(() => {
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    }, 100);
  } catch (error) {
    console.error('Download failed:', error);
    throw error;
  }
};

export const downloadCellsAlarms = async (area, strStartDate, strEndDate) => {
    try {
        // Construct the query parameters properly
        const params = new URLSearchParams({
            area:area,
            strStartDate: strStartDate,
            strEndDate: strEndDate,
        }).toString();

        // Make a GET request to the backend endpoint using Axios with responseType: 'blob'
        const response = await apiClient.get(`${BASE_URL}/downloadHistoricalCellsAlarmsReport?${params}`, {
            responseType: 'blob' // This is crucial for file downloads
        });

        // Get filename from response headers or use default
        const contentDisposition = response.headers['content-disposition'];
        let filename = `HistoricalCellAlarmsReport_${area}_${strStartDate}_to_${strEndDate}.xlsx`;
        
        if (contentDisposition) {
            const filenameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
            if (filenameMatch && filenameMatch[1]) {
                filename = filenameMatch[1].replace(/['"]/g, '');
            }
        }

        // Create a temporary URL for the Blob
        const url = window.URL.createObjectURL(new Blob([response.data]));

        // Create a temporary anchor element to trigger the download
        const a = document.createElement('a');
        a.href = url; 
        a.download = filename; // Use the extracted or generated filename
        a.style.display = 'none';
        document.body.appendChild(a); // Append the anchor to the DOM
        a.click(); // Programmatically click the anchor to trigger the download

        // Clean up
        window.URL.revokeObjectURL(url); // Release the object URL
        document.body.removeChild(a); // Remove the anchor from the DOM
        
    } catch (error) {
        console.error('Error downloading the Excel file:', error);
        // You might want to show a user-friendly error message here
    }
};