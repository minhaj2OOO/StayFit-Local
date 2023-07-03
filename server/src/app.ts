import { Server } from "@overnightjs/core";
import { initDB } from "./models";
import { ApiController } from "./controllers/ApiController";
import * as bodyParser from "body-parser";
import session from "express-session";
import cookieParser  from "cookie-parser";
import * as http from 'http';
import cors from 'cors';

export class App extends Server {
	private close: http.Server;

	constructor() {
		super();
		// setting up session
		this.app.use(
			session({
				secret: "secret",
				resave: true,
				saveUninitialized: true,
				cookie: {maxAge: 60 * 1000 * 300},
				rolling: true // reset exipration date with every request
			})
		);
		this.applyMiddleWares();
		this.boostrap();
		this.setupControllers();
	}

	public start(): void {
		const port = 3001;

		this.app.use((req, res, next) => {
			res.header('Access-Control-Allow-Origin', '*');
			res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
			next();
		});

		// Enable CORS for all routes
		this.app.use(cors());

		// Use the cookie-parser middleware
		this.app.use(cookieParser());

		this.close = this.app.listen(port, () => {
            console.log('Server listening on port: ' + port);
        });

	}

	private applyMiddleWares() {
		this.app.use(bodyParser.json());
		this.app.use(bodyParser.urlencoded({ extended: false }));
	}

	private async boostrap() {
		// Connect to db
		await initDB();
	}

	private setupControllers() {
		super.addControllers(new ApiController());
	}
}