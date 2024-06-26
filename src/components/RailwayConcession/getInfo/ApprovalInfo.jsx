import React, { useState } from "react";
import styles from "../RailwayConcession/RailwayConcession.module.css";
import {
  Timestamp,
  collection,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "@/src/config/firebase";
// import { toast } from "react-nextjs-toast";
import Spinner from "../Spinner";
const ApprovalInfo = ({
  request,
  handleCloseInfoWindow,
  fetchAllEnquiries,
}) => {
  const [certificateNumber, setCertificateNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const handleApprove = async () => {
    setLoading(true);
    try {
      const concessionDetailsCollection = collection(db, "ConcessionDetails");
      const concessionDetailsQuery = query(
        concessionDetailsCollection,
        where("firstName", "==", request.firstName),
        where("phoneNum", "==", request.phoneNum)
      );

      const concessionDetailsSnapshot = await getDocs(concessionDetailsQuery);

      if (!concessionDetailsSnapshot.empty) {
        const matchingDetailsDoc = concessionDetailsSnapshot.docs[0];
        const matchingDetailsRef = matchingDetailsDoc.ref;
        /* The code `await updateDoc(matchingDetailsRef, { lastPassIssued: Timestamp.now(), status:
        'serviced', statusMessage: 'Your request has been serviced!', });` is updating the
        `ConcessionDetails` document in the Firebase Firestore database. It sets the `lastPassIssued`
        field to the current timestamp, the `status` field to 'serviced', and the `statusMessage`
        field to 'Your request has been serviced!'. */
        await updateDoc(matchingDetailsRef, {
          lastPassIssued: Timestamp.now(),
          status: "serviced",
          statusMessage: "Your request has been serviced!",
        });

        // Update ConcessionRequest document
        const concessionRequestCollection = collection(db, "ConcessionRequest");
        const concessionRequestQuery = query(
          concessionRequestCollection,
          where("uid", "==", matchingDetailsDoc.id)
        );

        const concessionRequestSnapshot = await getDocs(concessionRequestQuery);

        if (!concessionRequestSnapshot.empty) {
          const matchingRequestDoc = concessionRequestSnapshot.docs[0];
          const matchingRequestRef = matchingRequestDoc.ref;

          /* The code `await updateDoc(matchingRequestRef, { status: 'serviced', passNum:
          certificateNumber, statusMessage: 'Your request has been serviced!', });` is updating the
          `ConcessionRequest` document in the Firebase Firestore database. */
          await updateDoc(matchingRequestRef, {
            status: "serviced",
            passNum: certificateNumber,
            statusMessage: "Your request has been serviced!",
          });

          await fetchAllEnquiries();
        //   toast.notify("Approved Request", { type: "info" });
          handleCloseInfoWindow();
        } else {
          console.error("ConcessionRequest document not found");
        }
      } else {
        console.error("ConcessionDetails document not found");
      }
      setLoading(false);
    } catch (error) {
      console.error("Error updating status and message:", error);
      setLoading(false);
    }
  };

  return (
    <div className={styles.modalDiv}>
      {loading && <Spinner />}
      <span className={styles.modalTitle}>Approve Concession Request?</span>
      <div className={styles.modalUpperDiv}>
        <div className={styles.studentApproveInfo}>
          <span className={styles.modalInformationTitle}>Name:</span>
          <span className={styles.modalInformation}>
            {request.firstName} {request.middleName} {request.lastName}
          </span>
        </div>
        <div className={styles.modalFromToDiv}>
          <div className={styles.studentApproveInfo}>
            <span className={styles.modalInformationTitle}>From:</span>
            <span className={styles.modalInformation}>{request.from}</span>
          </div>
          <div className={styles.studentApproveInfo}>
            <span className={styles.modalInformationTitle}>To:</span>
            <span className={styles.modalInformation}>{request.to}</span>
          </div>
        </div>
      </div>
      <div className={styles.modalLowerDiv}>
        <div className={styles.certificateSection}>
          <span className={styles.modalInformationTitle}>
            Certificate Number:
          </span>
          <input onChange={(e) => setCertificateNumber(e.target.value)}></input>
        </div>
        <div className={styles.modalButtonDiv}>
          <button className={styles.modalApproveButton} onClick={handleApprove}>
            Approve
          </button>
          <button
            className={styles.modalGoBackButton}
            onClick={handleCloseInfoWindow}
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default ApprovalInfo;