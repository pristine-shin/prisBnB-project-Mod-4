Phase 1:
npx sequelize model:generate --name User --attributes firstName:string,lastName:string,email:string,username:string,password:string

npx sequelize model:generate --name Review --attributes userId:integer,spotId:integer,review:string,stars:integer

npx sequelize model:generate --name Spot --attributes ownerId:integer,address:string,city:string,state:string,country:string,lat:decimal,lng:decimal,name:string,description:string,price:decimal

npx sequelize model:generate --name Booking --attributes spotId:integer,userId:integer,startDate:date,endDate:date

npx sequelize model:generate --name Image --attributes imageableId:integer,imageableType:string,url:string,preview:boolean

npx sequelize model:generate --name ReviewImage --attributes reviewId:integer,url:string

npx sequelize model:generate --name SpotImage --attributes spotId:integer,url:string,preview:boolean


Phase 2/3:
npx dotenv sequelize db:migrate

npx sequelize seed:generate --name demo-spot

npx sequelize seed:generate --name demo-review

npx sequelize seed:generate --name demo-booking

npx sequelize seed:generate --name demo-image

npx sequelize seed:generate --name demo-spot-image

npx sequelize seed:generate --name demo-review-image




npx dotenv sequelize db:seed:all

Phase 4:
npx sequelize model:generate --name DraftPick --attributes fanId:integer,playerId:integer

npx sequelize migration:generate --name add-sportId-to-teams
npx sequelize migration:generate --name add-currentTeamId-to-players


*** git commands: ***

git checkout dev

Then, make sure you have the latest changes in the development branch from
your remote repository in your local repository (this is useful when
collaborating with other developers):

git pull origin dev

Then, merge the feature branch into the `dev` branch:

git merge `<branch-name>`

Finally, push your changes to the development branch to the remote repository:

git push origin dev
