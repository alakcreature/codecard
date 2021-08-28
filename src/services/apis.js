const envoirnment = process.env.NODE_ENV;
const apis = {
    // Change the base_server_url to your domain name while you deploy your site to aws ec2
    BASE_LOCAL_URL : envoirnment === "development" ? "http://localhost:3000" : "",
    BASE_SERVER_URL : envoirnment === "development"? "http://localhost:7000/": "https://api.codecard.co.in",

    LOGIN : "/api/login",
    REGISTER : "/api/signup",
    VALIDATION: "/api/validation",
    GITHUBAUTHENTICATION: "/api/githublogin",
    FORGOT_PASSWORD : "/api/forgot-password",
    RESET_PASSWORD : "/api/reset-password",
    GET_USER_INFO : "/api/user-info",
    GET_OTHER_USER_INFO : "/api/other-user-info",
    ADD_USERNAME : "/api/addusername",
    
    
    UPCOMING_CONTESTS : "/api/upcoming-contests",
    

    PROBLEM_LIST : "/api/allproblems",
    SINGLE_PROBLEM : "/api/problem",
    SORTED_PROBLEM : "/api/sortedproblem",
    SOLVEDPROBLEM : "/api/solved",


    LEADERBOARD : "/api/leaderboard",
    SORTED_LEADERBOARD : "/api/sortedleaderboard",
    
    FEEDBACK : "/api/feedback",
    CONTACT : "/api/contactus",
    
    EMAILCONFIRM: "/api/confirmation",
    
    HOMEPAGESEARCH: "/api/homepagesearch",
    
    UPDATEPROFILEDETAILS: "/api/updateprofiledetails",
    CONNECTMYPROFILE: "/api/connectmyprofile"
};

export default apis;