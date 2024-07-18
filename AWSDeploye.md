Deploying your microservices and MongoDB on AWS involves several steps. Here's a detailed guide:

Step 1: Set Up AWS Account
Create an AWS Account:
If you don't already have an AWS account, sign up for one.
Step 2: Set Up MongoDB on AWS
Option 1: Using MongoDB Atlas
MongoDB Atlas is a cloud database service that simplifies deployment and management.

Sign Up for MongoDB Atlas:

Go to the MongoDB Atlas website and sign up for an account.
Create a Cluster:

Follow the prompts to create a new cluster. Choose AWS as the cloud provider and select a region close to your users.
Configure Network Access:

Allow access from your IP address or set up a VPC peering connection if you want to secure it within your AWS VPC.
Create a Database User:

Create a user with read and write access to your database.
Get Connection String:

Obtain the connection string for your cluster. It will look something like this:
bash
Copy code
mongodb+srv://<username>:<password>@cluster0.mongodb.net/test?retryWrites=true&w=majority
Update Your .env Files:

Replace the MONGO_URI in your microservices .env files with the Atlas connection string.
Option 2: Using Amazon DocumentDB
Amazon DocumentDB is a fully managed MongoDB-compatible database service.

Create a DocumentDB Cluster:

In the AWS Management Console, navigate to Amazon DocumentDB and create a new cluster.
Configure Cluster:

Choose the instance class, number of instances, and storage settings according to your needs.
Configure Network Access:

Ensure your cluster is accessible by your EC2 instances by setting up the appropriate security group rules.
Create Database User:

Create a master user and password for your database.
Get Connection String:

Obtain the connection string for your cluster, which will look something like this:
bash
Copy code
mongodb://<username>:<password>@docdb-2021-01-22-10-23-45.cluster-c0fe4w49x1xk.us-west-2.docdb.amazonaws.com:27017/admin?ssl=true&ssl_ca_certs=rds-combined-ca-bundle.pem&replicaSet=rs0
Update Your .env Files:

Replace the MONGO_URI in your microservices .env files with the DocumentDB connection string.
Step 3: Set Up AWS EC2 Instances for Microservices
Launch EC2 Instances:

In the AWS Management Console, navigate to EC2 and launch new instances for each microservice.
Choose AMI:

Select an Amazon Machine Image (AMI). For a Node.js application, the Amazon Linux 2 AMI is a good choice.
Configure Instance Details:

Set up your instances according to your needs. Ensure they are in the same VPC and subnet as your MongoDB cluster if using Amazon DocumentDB.
Add Storage:

Add any required storage for your instances.
Configure Security Groups:

Set up security groups to allow traffic on necessary ports (e.g., 3000 for your Gateway API, 4001-4004 for your microservices).
Launch Instances:

Review and launch your instances.
Connect to Instances:

Use SSH to connect to your instances. You can find connection details in the AWS Management Console.
Step 4: Deploy Microservices on EC2 Instances
Install Node.js and Git:

On each EC2 instance, install Node.js and Git:
bash
Copy code
sudo yum update -y
sudo yum install -y nodejs npm git
Clone Your Repository:

Clone your microservice repository on each instance:
bash
Copy code
git clone <your-repo-url>
cd <your-repo-directory>
Install Dependencies:

Install the necessary Node.js dependencies:
bash
Copy code
npm install
Set Up Environment Variables:

Create a .env file on each instance with the required environment variables, including the MONGO_URI pointing to your MongoDB Atlas or DocumentDB cluster.
Start the Services:

Start each service using a process manager like PM2 to keep them running:
bash
Copy code
npm install pm2 -g
pm2 start index.js --name <service-name>
pm2 startup
pm2 save
Step 5: Set Up Gateway API
Repeat the EC2 Setup:

Follow the same steps as above to set up an EC2 instance for your Gateway API.
Update Environment Variables:

Ensure the .env file includes the correct URLs for your microservices.
Deploy the Gateway API:

Clone the repository, install dependencies, and start the service using PM2 as described above.
Step 6: Configure Load Balancer (Optional)
Create an Application Load Balancer:

In the AWS Management Console, navigate to the EC2 dashboard and create a new load balancer.
Configure Load Balancer:

Set up listeners and target groups for your microservices and Gateway API.
Register Instances:

Add your EC2 instances to the appropriate target groups.
Update DNS:

Update your DNS settings to point to the load balancer for seamless traffic management.
Step 7: Monitor and Maintain
Set Up CloudWatch:

Use AWS CloudWatch to monitor the health and performance of your EC2 instances and services.
Implement Auto-Scaling:

Configure auto-scaling groups to handle traffic spikes and ensure high availability.
Regular Backups:

Set up regular backups for your MongoDB database using the backup tools provided by MongoDB Atlas or Amazon DocumentDB.
By following these steps, you will have a robust, scalable deployment of your online shopping app on AWS, with MongoDB handling the database and EC2 instances running your microservices.