import React, { use, useEffect, useState } from "react";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { db } from "@/config/firebase";
import { z } from "zod";
import RailwayUpdateCard from "./RailwayUpdateCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

const RailwayUpdateConc = () => {
  const [passes, setPasses] = useState<any[]>([]);
  const [passArrayLength, setPassArrayLength] = useState(null);

  const [searchInput, setSearchInput] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const formSchema = z.object({
    branch: z.string(),
    gradyear: z.string(),
    firstName: z.string(),
    middleName: z.string().optional(),
    lastName: z.string(),
    gender: z.string(),
    dob: z.date().refine(
      (date) => {
        // Check for undefined or null and return false if either is true
        if (date === undefined || date === null) {
          return false;
        }
        return true;
      },
      { message: "Field is required." }
    ),
    doi: z.date().refine(
      (date) => {
        // Check for undefined or null and return false if either is true
        if (date === undefined || date === null) {
          return false;
        }
        return true;
      },
      { message: "Field is required." }
    ),
    phoneNum: z.preprocess(
      (val) => {
        if (typeof val === "string") {
          if (val.trim() === "") {
            return undefined;
          }
          return NaN;
        }
        return Number(val);
      },
      z
        .number()
        .nonnegative()
        .refine(
          (value) => !isNaN(value) && value !== null && value !== undefined,
          {
            message:
              "Phone number cannot be a string and must be a valid number",
          }
        )
    ),
    address: z.string(),
    class: z.string(),
    duration: z.string(),
    travelLane: z.string(),
    from: z.string(),
    to: z.string(),
    certNo: z.string(),
  });

  useEffect(() => {
    const fetchAllRecentPasses = async () => {
      try {
        setLoading(true);
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const concessionDetailsRef = collection(db, "ConcessionDetails");
        const q = query(
          concessionDetailsRef,
          where("status", "in", ["serviced", "downloaded"])
        );
        const unsubscribe = onSnapshot(
          q,
          async (snapshot) => {
            const fetchedPasses = [];

            for (const docSnap of snapshot.docs) {
              const enquiry = docSnap.data();
              const lastPassIssued = enquiry.lastPassIssued?.toDate();

              if (lastPassIssued >= sevenDaysAgo) {
                const concessionRequestRef = doc(
                  db,
                  "ConcessionRequest",
                  docSnap.id
                );
                const requestDocSnap = await getDoc(concessionRequestRef);

                if (requestDocSnap.exists()) {
                  enquiry.certNo = requestDocSnap.data().passNum;
                  enquiry.uid = requestDocSnap.data().uid;
                  enquiry.dob = enquiry.dob.toDate();
                  enquiry.doi = enquiry.lastPassIssued.toDate();
                  enquiry.gradyear = enquiry.gradyear.toString();

                  fetchedPasses.push(enquiry);
                }
              }
            }

            let filteredPasses = fetchedPasses;

            if (searchInput.trim() === "") {
              setPasses(filteredPasses);
            } else {
              filteredPasses = fetchedPasses.filter((pass) =>
                pass.certNo.toLowerCase().includes(searchInput.toLowerCase())
              );
              setPasses(filteredPasses);
            }

            setPassArrayLength(filteredPasses.length);

            setLoading(false);
          },
          (error) => {
            console.error("Error fetching passes:", error);
          }
        );
        if (!loading) return () => unsubscribe();
      } catch (error) {
        toast({ description: "There was an error in fetching recent passes" });
        console.error("Error fetching recent passes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllRecentPasses();
  }, [searchInput]);

  useEffect(() => {
    if (passArrayLength == 0) {
      toast({ description: "No such pass found", variant: "destructive" });
    }
  }, [passArrayLength]);

  return (
    <div className="w-[75%] flex flex-col gap-[5rem]">
      <div className="flex w-full max-w-sm items-center space-x-2">
        <Input
          type="text"
          placeholder="Certificate No"
          onChange={(e) => setSearchInput(e.target.value)}
        />
      </div>
      {passes.map((pass, index) => {
        return (
          <div key={pass.certNo}>
            <RailwayUpdateCard formSchema={formSchema} passData={pass} />
          </div>
        );
      })}
    </div>
  );
};
export default RailwayUpdateConc;
