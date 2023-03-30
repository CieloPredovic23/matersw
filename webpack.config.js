const path = require("path");
const webpack = require("webpack");
const CompressionPlugin = require("compression-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const MonacoWebpackPlugin = require("monaco-editor-webpack-plugin");
const TerserPLugin = require("terser-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const { ProvidePlugin } = require("webpack");
const { version } = require("./package.json");

const OUTPUT_FOLDER = path.join(__dirname, "build");
const CODEBASE = path.join(__dirname, "source");

const { NODE_ENV, MODE, PUBLIC_URL_ROOT, HOTJAR, FRESHPAINT, SEGMENT, DEV_SERVER_PORT, DATADOG_RUM } = process.env;
const isProd = NODE_ENV === "prod";
const urlPrefix = MODE === "WEBSITE" ? PUBLIC_URL_ROOT : "";
const isHotjarEnabled = HOTJAR === "true";
const isFreshpaintEnabled = FRESHPAINT === "true";
const isDataDogRumEnabled = DATADOG_RUM === "true";
const isSegmentEnabled = SEGMENT === "true";
const publicPath = `${urlPrefix}/${version}/`;

const railsTransformer = mode => ({
	loader: "shell-loader",
	options: {
		script: `bundle exec ruby transformer.rb ${mode}`,
		cwd: "./rails",
		maxBuffer: Math.pow(1024, 3),
		env: { ...process.env, wfe_version: version }
	},
});

// const nextTransformer = () => ({
// 	loader: "shell-loader",
// 	options: {
// 		// script: "echo 'hello'",
// 		script: "curl http://localhost:3387/yml"
// 	},
// });

const nextTransformer = () => ({
	loader: "shell-loader",
	options: {
		cwd: "./_scripts",
		script: "node webpack_next_js_loader_script.js"
	},
});

const htmlExporter = {
	loader: "file-loader",
	options: {
		name: "[path][name].html"
	}
};

const htmlExporter2 = {
	loader: "file-loader",
	options: {
		// name: "[path][name].html"
		name(resourcePath, resourceQuery) {
			// `resourcePath` - `/absolute/path/to/file.js`
			// `resourceQuery` - `?foo=bar`

			console.log("html exporter for: " + resourcePath);
			console.log("html exporter for resourceQuery: " + resourceQuery);

			return "/templates/[name].html";
		},
	}
};

const assetExporter = (regex, folder) => ({
	test: regex,
	use: [
		{
			loader: "file-loader",
			options: {
				outputPath: folder,
				name: "[name].[ext]",
				publicPath: `${publicPath}${folder}`
			}
		}
	]
});

const entry = {
	vendor: "./javascripts/vendor.js",
	strings: "./javascripts/strings.js.erb",
	routes: "./javascripts/routes.js.erb",
	main: "./javascripts/index.js"
};
if (isHotjarEnabled) {
	entry.hotjar = "./javascripts/hotjar.js";
}
if (isFreshpaintEnabled) {
	entry.freshpaint = "./javascripts/freshpaint.js.erb";
}
if (isDataDogRumEnabled) {
	entry.datadogrum = "./javascripts/datadog-rum.js.erb";
}
if (isSegmentEnabled) {
	entry.segment = "./javascripts/segment.js.erb";
}

module.exports = {
	context: CODEBASE,

	devServer: {
		compress: true,
		port: DEV_SERVER_PORT || 4567,
		allowedHosts: [
			"host.docker.internal",
			"localhost"
		],
		headers: {
			"Access-Control-Allow-Origin": "*",
			"Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
			"Access-Control-Allow-Headers": "X-Requested-With, content-type, Authorization"
		},
		devMiddleware: {
			stats: "errors-only",
		},
		static: {
			directory: OUTPUT_FOLDER,
			publicPath: publicPath,
		},
		// proxy: {
		// 	"/1.3.203/templates/yml.html": {
    //     target: "http://localhost:3387/",
    //     pathRewrite: { "^/1.3.203/templates/yml.html": "" },
    //   },
    // },
	},

	devtool: `${isProd ? "hidden-" : ""}source-map`,

	entry: entry,

	optimization: {
		minimize: isProd,
		minimizer: [
			new TerserPLugin({
				extractComments: true,
				parallel: true,
				terserOptions: {
					mangle: false,
					safari10: true,
					output: {
						comments: /@license/i
					}
				}
			})
		]
	},

	performance: {
		hints: "error",
		maxAssetSize: 20000000,
		maxEntrypointSize: 40000000,
	},

	output: {
		filename: "javascripts/[name].js",
		path: OUTPUT_FOLDER,
		publicPath
	},

	resolve: {
		extensions: [".js", ".js.erb", ".ts", ".tsx", ".css", ".scss", ".scss.erb"]
	},

	module: {
		rules: [
			{
				test: /\.erb$/i,
				use: railsTransformer("erb")
			},

			{
				test: /\.tsx?$/,
				use: {
					loader: "ts-loader",
					options: {
						compilerOptions: {
							sourceMap: !isProd
						}
					}
				},
				exclude: [
					/node_modules/,
					/pages/
				]
			},

			{
				test: /\.tsx?$/,
				use: {
					loader: "ts-loader",
					options: {
						allowTsInNodeModules:true,
						compilerOptions: {
							sourceMap: !isProd
						}
					}
				},
				include: /node_modules\/@bitrise\/bitkit/
			},

			{
				test: /\.tsx?$/,
				use: [htmlExporter2, nextTransformer()],
				include: /pages/
			},

			{
				test: /\.(slim)$/,
				use: [htmlExporter, railsTransformer("slim")]
			},

			assetExporter(/\.(png|jpe?g|gif|svg)$/i, "images"),

			assetExporter(/\.(eot|woff2?|ttf)$/i, "fonts"),

			{
				test: /\.css$/i,
				include: path.join(__dirname, "node_modules"),
				use: ["style-loader", "css-loader"]
			},

			{
				test: /\.s[ac]ss(\.erb)?$/i,
				use: [MiniCssExtractPlugin.loader, "css-loader", railsTransformer("erb"), "sass-loader"]
			},

			{
				test: path.resolve(__dirname, "node_modules/normalize.css"),
				use: "null-loader"
			}
		]
	},
	plugins: [
		new webpack.EnvironmentPlugin(["MODE"]),
		new CompressionPlugin({
			algorithm: "gzip",
			test: /.js$|.css$/,
		}),
		new MiniCssExtractPlugin({
			filename: "stylesheets/[name].css"
		}),
		new MonacoWebpackPlugin({
			languages: ["yaml"],
			customLanguages: [
				{
					label: "yaml",
					entry: "monaco-yaml",
					worker: {
						id: "monaco-yaml/yamlWorker",
						entry: "monaco-yaml/yaml.worker",
					},
				},
			],
			features: [
				"!accessibilityHelp",
				"!bracketMatching",
				"!caretOperations",
				"!clipboard",
				"!codeAction",
				"!codelens",
				"!colorDetector",
				"!contextmenu",
				"!cursorUndo",
				"!dnd",
				"!fontZoom",
				"!format",
				"!gotoError",
				"!gotoSymbol",
				"!hover",
				"!iPadShowKeyboard",
				"!inPlaceReplace",
				"!inspectTokens",
				"!links",
				"!multicursor",
				"!parameterHints",
				"!quickCommand",
				"!quickOutline",
				"!referenceSearch",
				"!rename",
				"!smartSelect",
				"!snippets",
				"!suggest",
				"!toggleHighContrast",
				"!toggleTabFocusMode",
				"!transpose",
				"!wordHighlighter",
				"!wordOperations",
				"!wordPartOperations"
			]
		}),
		new ProvidePlugin({
			"window.jQuery": "jquery",
			"window._": "underscore"
		}),
		new CopyPlugin({
			patterns: [
				{ from: "images/favicons/*", to: OUTPUT_FOLDER }
			]
		})
	],
	infrastructureLogging: {
    debug: [name => name.includes("webpack-dev-server")],
  },
};
