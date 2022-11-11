import { GetServerSideProps } from "next"
import { useState } from "react";
import Image from "next/image";

import Head from "next/head";

// the choice to use css modules was made to avoid installing external libraries
import styles from "../../styles/jobs.module.css"

// import of the images from the assets folder
import mapIcon from "../../assets/mapLogo.webp"
import stairIcon from "../../assets/stair.png"


// interface for the job object that is received from the request
interface Job {
    jobId: string
    OBJcity: string;
    companyName: string;
    OBJdesc: string;
    postedDate: string;
    OBJstate: string;
    OBJtitle: string;
    companyLogo: string;
    estimatedSalary: string
    jobLevels: string[];
    postingDate: string;
}

// interface for the props received by the component
interface JobsProps {
    response: {
        jobs: Job[];
        totalJobs: number;
        remainingJobs: number;
    }
}

export default function Jobs(props: JobsProps) {
    // state to store the jobs. Receives all jobs but keep just the first 10 
    const [jobs, setJobs] = useState(props.response.jobs.slice(0, 10))

    // state to keep the selected job. Used to show in the bigger card (card of the right)
    const [selectedJob, setSelectedJob] = useState(props.response.jobs[0])

    // function to change the selected job. It changes based in the index of the map used to display
    // all the jobs
    function changeSelectedJob(index: number) {
        setSelectedJob(jobs[index])
    }

    // function to filter the jobs by the input. When the input changes, it filters all the jobs by company name.
    // Lower case is used to prevent errors from capital letters
    function filterJobs(event: React.ChangeEvent<HTMLInputElement>) {
        setJobs(props.response.jobs.filter((job: Job) => {
            return job.companyName.toLowerCase().includes(event.target.value)
        }).slice(0, 10))
    }

    // function used to filter jobs in the last seven days. It gets the post date of every job and compares
    // with the actual date subtracted by 7 days, and only keeps the jobs that are posted in the last 7 days.
    // It also shows only 10 jobs at once
    function filterJobsLastSevenDays(event: React.FormEvent<HTMLButtonElement>) {
        event.preventDefault()
        setJobs(props.response.jobs.filter((job: Job) => {
            const originalPostDate: Date = new Date(job.postingDate)
            const lastWeekDate: Date = new Date()

            lastWeekDate.setDate(lastWeekDate.getDate() - 7)

            return originalPostDate.getTime() >= lastWeekDate.getTime()
        }).slice(0, 10))
    }

    // function used to check if the job posting date was in the last 7 days. In affirmative case, the card of the
    // job on the left will have "New" right in the side of the posting information
    function checkNewJob(postingDate: string) {
        const originalPostDate: Date = new Date(postingDate)
        const lastWeekDate: Date = new Date()

        lastWeekDate.setDate(lastWeekDate.getDate() - 7)

        return originalPostDate.getTime() >= lastWeekDate.getTime()
    }

    return (
        <div>
            <Head>
                <title>Jobs | Zippia</title>
                <link rel="icon" type="image/x-icon" href="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSQSDMrhxrg7L_0TWNpEi6zNPsXgkpcfEt9907_Q4ck3kps6YupclczxGRFCjjbcrhVhRg&usqp=CAU"></link>
            </Head>
        
        {/* div that contains all the information of the page */}
            <div className={styles.pageContainer}>

                {/* section that contains the input and the button to filter */}
                <section className={styles.inputSection}>
                    <input className={styles.inputCompany} onChange={filterJobs} placeholder="Filter by company name" type="text" name="companyName"/>
                    <button onClick={filterJobsLastSevenDays} className={styles.filterButton}>Show jobs published in last 7 days</button>
                </section>

                {/* div that contains all the cards in the left and the main card (left card) */}
                <div className={styles.jobsContainer}>

                    {/* 
                        this section contains all the jobs in the left. It iterates in the jobs array received
                        by props and make a card for every job. In case there is no jobs, it will display a message telling
                        that no jobs were found.  
                    */}
                    <section>
                    {
                        jobs.length === 0
                        ?
                        <div className={styles.notFoundError}>
                            No jobs found.
                        </div>
                        :
                        jobs.map((job: Job, index: number) => {
                            // this map returns all the info about the job, like the company name, company logo, job title
                            // the selected job (the one who's in the right card) will have a blue border in the left side
                            return (
                                <div 
                                    key={job.jobId} 
                                    className={`${selectedJob.jobId === job.jobId ? styles.selectedJob : styles.cardContainer}`}
                                    onClick={(_) => changeSelectedJob(index)}
                                >
                                    <img className={styles.companyLogo} src={job.companyLogo} alt="Company logo"/>
                                    <section className={styles.textContainer}>
                                        <div className={styles.jobTitleMiniCard}>{job.OBJtitle}</div>
                                        <div className={styles.companyNameMiniCard}>{job.companyName}</div>
                                        <div className={styles.jobDescriptionMiniCard}>{job.OBJdesc.slice(0, 200) + "..."}</div>
                                        <div className={styles.addInfo}>
                                            <span>
                                                {job.estimatedSalary}
                                            </span>
                                            <div>
                                            {
                                                checkNewJob(job.postingDate)
                                                &&
                                                <span className={styles.newJobSpan}>New {" "}</span>
                                            }
                                            <span>{job.postedDate}</span>
                                            </div>
                                        </div>
                                    </section>
                                </div>
                            )
                        })
                    }

                    {/* 
                        this section contains the card on the right, that shows all the text and details from the job. 
                        It only will be showed in the case there is at least one job in the list at left. When you click at one
                        job at the left list, it will be displayed in this card.
                    */}
                    </section>
                    {
                        jobs.length > 0
                        &&
                        <div className={styles.fixedJob}>
                                {/* all the main infos about the job */}
                                <h1 className={styles.titleFixedCard}>{selectedJob.OBJtitle}</h1>
                                <h2 className={styles.companyNameFixedCard}>{selectedJob.companyName}</h2>
                                <h3 className={styles.jobCityFixedCard}>{`${selectedJob.OBJcity}, ${selectedJob.OBJstate}`}</h3>
                                <h5 className={styles.jobSalaryFixedCard}>{selectedJob.estimatedSalary}</h5>

                                {/* this represents the horizontal line to separate the sections */}
                                <hr className={styles.hr}/>

                                {/* the section where the highlights are showed, like the city and the level of the job */}
                                <div className={styles.jobSection}>                                
                                    <p className={styles.titleFixedCard}>Job Highlights</p>
                                    <div className={styles.jobHighlights}>
                                        <div className={styles.jobHighlight}>
                                            <Image src={mapIcon} alt="Map icon" width={16}/>
                                            <span>{`${selectedJob.OBJcity}, ${selectedJob.OBJstate}`}</span>
                                        </div>
                                        <div className={styles.jobHighlight}>
                                            <Image src={stairIcon} alt="Map icon" width={24}/>
                                            <span>{selectedJob.jobLevels.join()}</span>
                                        </div>
                                    </div>
                                </div>

                                <hr className={styles.hr}/>

                                {/* section that shows the job description */}
                                <div className={`${styles.jobDescription} ${styles.jobSection}`}>
                                    <p className={styles.titleFixedCard}>Job Description</p>
                                    <p>{selectedJob.OBJdesc}</p>
                                </div>
                        </div>
                    }
                </div>
            </div>
        </div>
    )
}

// server side rendering function. It makes the request to the api, get the response as JSON and passes to the component
export const getServerSideProps: GetServerSideProps = async() => {
    const response = await fetch('https://www.zippia.com/api/jobs/', {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify({
            "companySkills": true,
            "dismissedListingHashes": [],
            "fetchJobDesc": true,
            "jobTitle": "Business Analyst",
            "locations": [],
            "numJobs": 20,
            "previousListingHashes": []
        })
    })

    const jobsInfo = await response.json()
    
    return {props: {response: jobsInfo}}
}