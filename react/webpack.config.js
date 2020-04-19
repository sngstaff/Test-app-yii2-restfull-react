const path = require("path");
const HWP = require("html-webpack-plugin");

module.exports = {
    entry: "./src/index.js",
    output: {
        path: path.join(__dirname, "/dist"),
        filename: "bundle.js",
        publicPath: "/"
    },
    resolve: {
        extensions: ['.js', '.jsx'],
        alias: {
            "@helpers": path.join(__dirname, "./src/helpers"),
            "@layout": path.join(__dirname, "./src/layout"),
            '@services': path.join(__dirname, './src/services'),
            '@static': path.join(__dirname, './static'),
            '@pages': path.join(__dirname, './src/components/pages'),
            '@config': path.join(__dirname, './src/config'),
            "@components": path.join(__dirname, './src/components'),
            '@progress': path.join(__dirname, './src/helpers/progress'),
            '@alert': path.join(__dirname, './src/helpers/alert'),
        },
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader"
                }
            },
            {
                test: /\.css$/,
                use: ["style-loader", "css-loader"]
            },
            {
                test: /\.(png|jpg|gif|woff|woff2|ttf|jpeg|svg|eot|otf)(\?.*$|$)/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {},
                    },
                ],
            },
        ]
    },
    devServer: {
        historyApiFallback: {
            index: '/dist/index.html'
        },
        contentBase: './',
        hot: true,
    },
    plugins: [
        new HWP({
            template: "./src/index.html"
        })
    ]
};