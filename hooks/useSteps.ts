import { useEffect, useState } from "react";
import AppleHealthKit, {
  HealthInputOptions,
  HealthKitPermissions,
} from "react-native-health";
import GoogleFit, { Scopes } from "react-native-google-fit";
import { Platform } from "react-native";

// Define permissions
const permissions: HealthKitPermissions = {
  permissions: {
    read: [AppleHealthKit.Constants.Permissions.StepCount],
    write: [AppleHealthKit.Constants.Permissions.StepCount], // Required field
  },
};

const useSteps = () => {
  const [steps, setSteps] = useState<number>(0);

  useEffect(() => {
    if (Platform.OS === "ios") {
      requestAppleHealthPermissions();
    } else {
      requestGoogleFitPermissions();
    }
  }, []);

  // Request Apple HealthKit Permissions (iOS)
  const requestAppleHealthPermissions = () => {
    AppleHealthKit.initHealthKit(permissions, (err) => {
      if (err) {
        console.log("Error initializing Apple HealthKit:", err);
        return;
      }
      fetchAppleHealthSteps();
    });
  };

  // Fetch Steps from Apple HealthKit
  const fetchAppleHealthSteps = () => {
    const options: HealthInputOptions = {
      startDate: new Date(new Date().setHours(0, 0, 0, 0)).toISOString(), // Start of today
      endDate: new Date().toISOString(), // Current time
    };

    AppleHealthKit.getStepCount(options, (err, results) => {
      if (err) {
        console.log("Error fetching step count from Apple Health:", err);
        return;
      }
      setSteps(results?.value ?? 0);
    });
  };

  // Request Google Fit Permissions (Android)
  const requestGoogleFitPermissions = async () => {
    try {
      const isAuthorized = await GoogleFit.authorize({
        scopes: [Scopes.FITNESS_ACTIVITY_READ, Scopes.FITNESS_ACTIVITY_WRITE],
      });
  
      if (isAuthorized.success) {
        fetchGoogleFitSteps();
      } else {
        console.log("Google Fit authorization failed.");
      }
    } catch (error) {
      console.log("Google Fit permission error:", error);
    }
  };
  

  // Fetch Steps from Google Fit
  const fetchGoogleFitSteps = async () => {
    try {
      const options = {
        startDate: new Date(new Date().setHours(0, 0, 0, 0)).toISOString(), // Start of today
        endDate: new Date().toISOString(), // Current time
      };

      const response = await GoogleFit.getDailyStepCountSamples(options);

      if (response.length > 0) {
        const stepsData = response.find((data) => data.source === "com.google.android.gms:estimated_steps");
        setSteps(stepsData?.steps?.[0]?.value ?? 0);
      }
    } catch (error) {
      console.log("Error fetching step count from Google Fit:", error);
    }
  };

  return steps;
};

export default useSteps;
