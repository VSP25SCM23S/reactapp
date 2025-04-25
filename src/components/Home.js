/*
Goal of React:
  1. React will retrieve GitHub created and closed issues for a given repository and will display the bar-charts 
     of same using high-charts        
  2. It will also display the images of the forecasted data for the given GitHub repository and images are being retrieved from 
     Google Cloud storage
  3. React will make a fetch api call to flask microservice.
*/

// Import required libraries
import * as React from "react";
import { useState } from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import AppBar from "@mui/material/AppBar";
import CssBaseline from "@mui/material/CssBaseline";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import StackedBarChart from "./StackedBarChart";

// Import custom components
import BarCharts from "./BarCharts";
import Loader from "./Loader";
import { ListItemButton } from "@mui/material";
import axios from "axios";

const drawerWidth = 240;
// List of GitHub repositories 
const repositories = [
  {
    key: "meta-llama/llama3",
    value: "Meta Llama3",
  },
  {
    key: "ollama/ollama",
    value: "Ollama",
  },
  {
    key: "langchain-ai/langchain",
    value: "Langchain",
  },
  {
    key: "langchain-ai/langgraph",
    value: "Langgraph",
  },
  {
    key: "microsoft/autogen",
    value: "Autogen",
  },
  {
    key: "openai/openai-cookbook",
    value: "OpenAI Cookbook",
  },
  {
    key: "elastic/elasticsearch",
    value: "Elasticsearch",
  },
  {
    key: "milvus-io/pymilvus",
    value: "Pymilvus",
  },
  {
    key: "angular/angular",
    value: "Angular",
  },
  {
    key: "angular/angular-cli",
    value: "Angular-cli",
  },
  {
    key: "angular/material",
    value: "Angular Material",
  },
  {
    key: "d3/d3",
    value: "D3",
  },
];

export default function Home() {
  /*
  The useState is a react hook which is special function that takes the initial 
  state as an argument and returns an array of two entries. 
  */
  /*
  setLoading is a function that sets loading to true when we trigger flask microservice
  If loading is true, we render a loader else render the Bar charts
  */
  const [loading, setLoading] = useState(true);
  /* 
  setRepository is a function that will update the user's selected repository such as Angular,
  Angular-cli, Material Design, and D3
  The repository "key" will be sent to flask microservice in a request body
  */
  const [repository, setRepository] = useState({
    key: "angular/angular",
    value: "Angular",
  });
  /*
  
  The first element is the initial state (i.e. githubRepoData) and the second one is a function 
  (i.e. setGithubData) which is used for updating the state.

  so, setGitHub data is a function that takes the response from the flask microservice 
  and updates the value of gitHubrepo data.
  */
  const [githubRepoData, setGithubData] = useState([]);
  const [githubRepoDetailsData, setGithubRepoDetailsData] = useState([]);

  // Updates the repository to newly selected repository
  const eventHandler = (repo) => {
    console.log("Selected Repository:", repo);
    setRepository(repo);
  };

  /* 
  Fetch the data from flask microservice on Component load and on update of new repository.
  Everytime there is a change in a repository, useEffect will get triggered, useEffect inturn will trigger 
  the flask microservice 
  */
  // React.useEffect(() => {
  //   // set loading to true to display loader
  //   console.log("Flask API Loading:");
    
  //   setLoading(true);
  //   const requestOptions = {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     // Append the repository key to request body
  //     body: JSON.stringify({ repository: repository.key }),
  //   };
    
  //   /*
  //   Fetching the GitHub details from flask microservice
  //   The route "/api/github" is served by Flask/App.py in the line 53
  //   @app.route('/api/github', methods=['POST'])
  //   Which is routed by setupProxy.js to the
  //   microservice target: "your_flask_gcloud_url"
  //   */
  //  console.log("Flask API:", requestOptions);
  //   fetch("/api/github", requestOptions)
  //     .then((res) => {
  //       console.log("Received response from Flask API:", res);
  //       if (!res.ok) {
  //         console.error("Response not OK. Status:", res.status);
  //         throw new Error(`HTTP status ${res.status}`);
  //       }
  //       return res.json();
  //     })
  //     .then(
  //       // On successful response from flask microservice
  //       (result) => {
  //         console.log("Successfully parsed JSON from Flask:", result);
  //         // On success set loading to false to display the contents of the resonse
  //         setLoading(false);
  //         // Set state on successfull response from the API
  //         setGithubData(result);
  //       },
  //       // On failure from flask microservice
  //       (error) => {
  //         console.error("Error fetching or parsing data from Flask API:", error);

  //         // Set state on failure response from the API
  //         console.log(error);
  //         // On failure set loading to false to display the error message
  //         setLoading(false);
  //         setGithubData([]);
  //       }
  //     );
  // }, [repository]);

  const instance = axios.create();

  React.useEffect(() => {
		// set loading to true to display loader
		const fetchGitRepoData = async () => {
			setLoading(true);
			/*
				Fetching the GitHub details from flask microservice
				The route "/api/github" is served by Flask/App.py in the line 53
				@app.route('/api/github', methods=['POST'])
				Which is routed by setupProxy.js to the
				microservice target: "your_flask_gcloud_url"
			*/
			await instance
				.post(
					"/api/github",
					{ repository: repository.key },
					{ headers: { "Content-Type": "application/json" } }
				)
				.then(
					// On successful response from flask microservice
					(result) => {
						// On success set loading to false to display the contents of the response
						setLoading(false);
						// Set state on successful response from the API
						setGithubData(result.data);
						console.log("data" ,result.data.closed )
					},
					// On failure from flask microservice
					(error) => {
						// Set state on failure response from the API
						console.log(error);
						// On failure set loading to false to display the error message
						setLoading(false);
						setGithubData([]);
					}
				);
		};
	
		const fetchGitRepoDetailsData = async () => {
			setLoading(true);
			const repositories_json = repositories.map(({ key, value }) => ({
				name: key,
			}));
	
			await instance
				.post("/api/github/details", repositories_json, {
					headers: { "Content-Type": "application/json" },
				})
				.then(
					// On successful response from flask microservice
					(result) => {
						// On success set loading to false to display the contents of the response
						setLoading(false);
						// Set state on successful response from the API
						setGithubRepoDetailsData(result.data);
					},
					// On failure from flask microservice
					(error) => {
						// Set state on failure response from the API
						console.log(error);
						// On failure set loading to false to display the error message
						setLoading(false);
						setGithubRepoDetailsData([]);
					}
				);
		};
	
		fetchGitRepoDetailsData();
		fetchGitRepoData();
	}, [repository]); // Added dependency array
	
	return (
		<Box sx={{ display: "flex" }}>
			<CssBaseline />
			{/* Application Header */}
			<AppBar
				position="fixed"
				sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
			>
				<Toolbar>
					<Typography variant="h6" noWrap component="div">
						Timeseries Forecasting
					</Typography>
				</Toolbar>
			</AppBar>
			{/* Left drawer of the application */}
			<Drawer
				variant="permanent"
				sx={{
					width: drawerWidth,
					flexShrink: 0,
					[`& .MuiDrawer-paper`]: {
						width: drawerWidth,
						boxSizing: "border-box",
					},
				}}
			>
				<Toolbar />
				<Box sx={{ overflow: "auto" }}>
					<List>
						{/* Iterate through the repositories list */}
						{repositories.map((repo) => (
							<ListItem
								button
								key={repo.key}
								onClick={() => eventHandler(repo)}
								disabled={loading && repo.value !== repository.value}
							>
								<ListItemButton selected={repo.value === repository.value}>
									<ListItemText primary={repo.value} />
								</ListItemButton>
							</ListItem>
						))}
					</List>
				</Box>
			</Drawer>
			<Box component="main" sx={{ flexGrow: 1, p: 3 }}>
				<Toolbar />
				{/* Render loader component if loading is true else render charts and images */}
				{loading ? (
					<Loader />
				) : (
					<div>
						{/* Render barchart component for a monthly created issues for a selected repositories*/}
						<BarCharts
							title={`Monthly Created Issues for ${repository.value} 2 months`}
							data={githubRepoData?.created}
							text="Issues"
							type="column"
						/>
						{/* Render barchart component for a monthly created issues for a selected repositories*/}
						<BarCharts
							title={`Weekly Closed Issues for ${repository.value} 2 months`}
							data={githubRepoData?.closed}
							
							text="Issues"
							type="column"
						/>
						<Divider
							sx={{ borderBlockWidth: "3px", borderBlockColor: "#FFA500" }}
						/>
						<BarCharts
							title={`Issues Count for the Repositories`}
							data={githubRepoDetailsData?.map((ele) => {
								let repo_name = repositories.find(
									({ key, value }) => key === ele.name
								);
								const { key, value } = repo_name;
								return [value, ele.total_issues];
							})}
							text="Stars"
							type="line"
						/>
						<Divider
							sx={{ borderBlockWidth: "3px", borderBlockColor: "#FFA500" }}
						/>
						<BarCharts
							title={`Star Count for the Repositories`}
							data={githubRepoDetailsData?.map((ele) => {
								let repo_name = repositories.find(
									({ key, value }) => key === ele.name
								);
								const { key, value } = repo_name;
								return [value, ele.stars];
							})}
							text="Stars"
							type="column"
						/>
						<Divider
							sx={{ borderBlockWidth: "3px", borderBlockColor: "#FFA500" }}
						/>
						<BarCharts
							title={`Fork Count for the Repositories`}
							data={githubRepoDetailsData?.map((ele) => {
								let repo_name = repositories.find(
									({ key, value }) => key === ele.name
								);
								const { key, value } = repo_name;
								return [value, ele.forks];
							})}
							text="Forks"
							type="column"
						/>
						<Divider
							sx={{ borderBlockWidth: "3px", borderBlockColor: "#FFA500" }}
						/>
						<StackedBarChart
							title={`Issues Created and Closed for the Repositories`}
							data={githubRepoDetailsData?.map((ele) => {
								let repo_name = repositories.find(
									({ key, value }) => key === ele.name
								);
								const { key, value } = repo_name;
								return [value, ele.total_issues];
							})}
							closedIssueData={githubRepoDetailsData?.map((ele) => {
								let repo_name = repositories.find(
									({ key, value }) => key === ele.name
								);
								const { key, value } = repo_name;
								return [value, ele.closed_issues];
							})}
							text="Issues"
							totalIssueText="Issues Created"
							closedIssueText="Issues Closed"
						/>
						{/* Rendering Timeseries Forecasting of Created Issues using Tensorflow and
                Keras LSTM and FB Prophet and StatsModels */}
						<div>
							<Typography variant="h5" component="div" gutterBottom>
								Timeseries Forecasting of Created Issues using Tensorflow and
								Keras LSTM based on past month
							</Typography>

							<div>
								<Typography component="h4">
									Model Loss for Created Issues
								</Typography>
								{/* Render the model loss image for created issues */}
								<img
									src={githubRepoData?.createdAtImageUrls?.model_loss_image_url}
									alt={"Model Loss for Created Issues"}
									loading={"lazy"}
								/>
							</div>
							<div>
								<Typography component="h4">
									LSTM Generated Data for Created Issues
								</Typography>
								{/* Render the LSTM generated image for created issues*/}
								<img
									src={
										githubRepoData?.createdAtImageUrls?.lstm_generated_image_url
									}
									alt={"LSTM Generated Data for Created Issues"}
									loading={"lazy"}
								/>
							</div>
							<div>
								<Typography component="h4">
									All Issues Data for Created Issues
								</Typography>
								{/* Render the all issues data image for created issues*/}
								<img
									src={
										githubRepoData?.createdAtImageUrls?.all_issues_data_image
									}
									alt={"All Issues Data for Created Issues"}
									loading={"lazy"}
								/>
							</div>
							<div>
								<Typography component="h4">
									FB Prophet Forecast for Created Issues
								</Typography>
								{/* Render the fb prophet forecast image for created issues*/}
								<img
									src={
										githubRepoData?.createdAtImageUrls
											?.prophet_forecast_data_image
									}
									alt={"FB Prophet Forecast for Created Issues"}
									loading={"lazy"}
								/>
							</div>
							<div>
								<Typography component="h4">
									StatsModel Forecast for Created Issues
								</Typography>
								{/* Render the statsmodels forecast image for created issues*/}
								<img
									src={
										githubRepoData?.createdAtImageUrls
											?.statsmodels_forecast_data_image
									}
									alt={"StatsModels Prophet Forecast for Created Issues"}
									loading={"lazy"}
								/>
							</div>
						</div>
						{/* Rendering Timeseries Forecasting of Closed Issues using Tensorflow and
                Keras LSTM and FB Prophet and StatsModels */}
						<div>
							<Divider
								sx={{ borderBlockWidth: "3px", borderBlockColor: "#FFA500" }}
							/>
							<Typography variant="h5" component="div" gutterBottom>
								Timeseries Forecasting of Closed Issues using Tensorflow and
								Keras LSTM based on past month
							</Typography>

							<div>
								<Typography component="h4">
									Model Loss for Closed Issues
								</Typography>
								{/* Render the model loss image for closed issues  */}
								<img
									src={githubRepoData?.closedAtImageUrls?.model_loss_image_url}
									alt={"Model Loss for Closed Issues"}
									loading={"lazy"}
								/>
							</div>
							<div>
								<Typography component="h4">
									LSTM Generated Data for Closed Issues
								</Typography>
								{/* Render the LSTM generated image for closed issues */}
								<img
									src={
										githubRepoData?.closedAtImageUrls?.lstm_generated_image_url
									}
									alt={"LSTM Generated Data for Closed Issues"}
									loading={"lazy"}
								/>
							</div>
							<div>
								<Typography component="h4">
									All Issues Data for Closed Issues
								</Typography>
								{/* Render the all issues data image for closed issues*/}
								<img
									src={githubRepoData?.closedAtImageUrls?.all_issues_data_image}
									alt={"All Issues Data for Closed Issues"}
									loading={"lazy"}
								/>
							</div>
							<div>
								<Typography component="h4">
									FB Prophet Forecast for Closed Issues
								</Typography>
								{/* Render the fb prophet forecast image for Closed issues*/}
								<img
									src={
										githubRepoData?.closedAtImageUrls
											?.prophet_forecast_data_image
									}
									alt={"FB Prophet Forecast for Closed Issues"}
									loading={"lazy"}
								/>
							</div>
							<div>
								<Typography component="h4">
									StatsModel Forecast for Closed Issues
								</Typography>
								{/* Render the statsmodels forecast image for Closed issues*/}
								<img
									src={
										githubRepoData?.closedAtImageUrls
											?.statsmodels_forecast_data_image
									}
									alt={"StatsModels Prophet Forecast for Closed Issues"}
									loading={"lazy"}
								/>
							</div>
						</div>
						{/* Rendering Timeseries Forecasting of Pull Requests using Tensorflow and
                Keras LSTM and FB Prophet and StatsModels */}
						<div>
							<Typography variant="h5" component="div" gutterBottom>
								Timeseries Forecasting of Pull Requests using Tensorflow and
								Keras LSTM based on past month
							</Typography>

							<div>
								<Typography component="h4">
									Model Loss for Pull Requests
								</Typography>
								{/* Render the model loss image for Pull Requests */}
								<img
									src={
										githubRepoData?.prCreatedAtImageUrls?.model_loss_image_url
									}
									alt={"Model Loss for Pull Requests"}
									loading={"lazy"}
								/>
							</div>
							<div>
								<Typography component="h4">
									LSTM Generated Data for Pull Requests
								</Typography>
								{/* Render the LSTM generated image for Pull Requests*/}
								<img
									src={
										githubRepoData?.prCreatedAtImageUrls
											?.lstm_generated_image_url
									}
									alt={"LSTM Generated Data for Pull Requests"}
									loading={"lazy"}
								/>
							</div>
							<div>
								<Typography component="h4">
									All Issues Data for Pull Requests
								</Typography>
								{/* Render the all issues data image for Pull Requests*/}
								<img
									src={
										githubRepoData?.prCreatedAtImageUrls?.all_issues_data_image
									}
									alt={"All Issues Data for Pull Requests"}
									loading={"lazy"}
								/>
							</div>
							<div>
								<Typography component="h4">
									FB Prophet Forecast for Pull Requests
								</Typography>
								{/* Render the fb prophet forecast image for Pull Requests*/}
								<img
									src={
										githubRepoData?.prCreatedAtImageUrls
											?.prophet_forecast_data_image
									}
									alt={"FB Prophet Forecast for Pull Requests"}
									loading={"lazy"}
								/>
							</div>
							<div>
								<Typography component="h4">
									StatsModel Forecast for Pull Requests
								</Typography>
								{/* Render the statsmodels forecast image for Pull Requests*/}
								<img
									src={
										githubRepoData?.prCreatedAtImageUrls
											?.statsmodels_forecast_data_image
									}
									alt={"StatsModels Prophet Forecast for Pull Requests"}
									loading={"lazy"}
								/>
							</div>
						</div>
						{/* Rendering Timeseries Forecasting of Commits using Tensorflow and
                Keras LSTM and FB Prophet and StatsModels */}
						<div>
							<Typography variant="h5" component="div" gutterBottom>
								Timeseries Forecasting of Commits using Tensorflow and Keras
								LSTM based on past month
							</Typography>

							<div>
								<Typography component="h4">Model Loss for Commits</Typography>
								{/* Render the model loss image for Commits */}
								<img
									src={
										githubRepoData?.commitCreatedAtImageUrls
											?.model_loss_image_url
									}
									alt={"Model Loss for Commits"}
									loading={"lazy"}
								/>
							</div>
							<div>
								<Typography component="h4">
									LSTM Generated Data for Commits
								</Typography>
								{/* Render the LSTM generated image for Commits*/}
								<img
									src={
										githubRepoData?.commitCreatedAtImageUrls
											?.lstm_generated_image_url
									}
									alt={"LSTM Generated Data for Commits"}
									loading={"lazy"}
								/>
							</div>
							<div>
								<Typography component="h4">
									All Issues Data for Commits
								</Typography>
								{/* Render the all issues data image for Commits*/}
								<img
									src={
										githubRepoData?.commitCreatedAtImageUrls
											?.all_issues_data_image
									}
									alt={"All Issues Data for Commits"}
									loading={"lazy"}
								/>
							</div>
							<div>
								<Typography component="h4">
									FB Prophet Forecast for Commits
								</Typography>
								{/* Render the fb prophet forecast image for Commits*/}
								<img
									src={
										githubRepoData?.commitCreatedAtImageUrls
											?.prophet_forecast_data_image
									}
									alt={"FB Prophet Forecast for Commits"}
									loading={"lazy"}
								/>
							</div>
							<div>
								<Typography component="h4">
									StatsModel Forecast for Commits
								</Typography>
								{/* Render the statsmodels forecast image for Commits*/}
								<img
									src={
										githubRepoData?.commitCreatedAtImageUrls
											?.statsmodels_forecast_data_image
									}
									alt={"StatsModels Prophet Forecast for Commits"}
									loading={"lazy"}
								/>
							</div>
						</div>
						{/* Rendering Timeseries Forecasting of Branches using Tensorflow and
                Keras LSTM and FB Prophet and StatsModels */}
						<div>
							<Typography variant="h5" component="div" gutterBottom>
								Timeseries Forecasting of Branches using Tensorflow and Keras
								LSTM based on past month
							</Typography>

							<div>
								<Typography component="h4">Model Loss for Branches</Typography>
								{/* Render the model loss image for Branches */}
								<img
									src={
										githubRepoData?.branchCreatedAtImageUrls
											?.model_loss_image_url
									}
									alt={"Model Loss for Branches"}
									loading={"lazy"}
								/>
							</div>
							<div>
								<Typography component="h4">
									LSTM Generated Data for Branches
								</Typography>
								{/* Render the LSTM generated image for Branches*/}
								<img
									src={
										githubRepoData?.branchCreatedAtImageUrls
											?.lstm_generated_image_url
									}
									alt={"LSTM Generated Data for Branches"}
									loading={"lazy"}
								/>
							</div>
							<div>
								<Typography component="h4">
									All Issues Data for Branches
								</Typography>
								{/* Render the all issues data image for Branches*/}
								<img
									src={
										githubRepoData?.branchCreatedAtImageUrls
											?.all_issues_data_image
									}
									alt={"All Issues Data for Branches"}
									loading={"lazy"}
								/>
							</div>
							<div>
								<Typography component="h4">
									FB Prophet Forecast for Branches
								</Typography>
								{/* Render the fb prophet forecast image for Branches*/}
								<img
									src={
										githubRepoData?.branchCreatedAtImageUrls
											?.prophet_forecast_data_image
									}
									alt={"FB Prophet Forecast for Branches"}
									loading={"lazy"}
								/>
							</div>
							<div>
								<Typography component="h4">
									StatsModel Forecast for Branches
								</Typography>
								{/* Render the statsmodels forecast image for Branches*/}
								<img
									src={
										githubRepoData?.branchCreatedAtImageUrls
											?.statsmodels_forecast_data_image
									}
									alt={"StatsModels Prophet Forecast for Branches"}
									loading={"lazy"}
								/>
							</div>
						</div>
					</div>
				)}
			</Box>
		</Box>
	);
}
