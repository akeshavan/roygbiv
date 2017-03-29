import os

from flask import Flask, send_from_directory

#from . import HTML_DIR, DATA_DIR

_cur_dir = os.path.abspath(os.path.dirname(__file__))
HTML_DIR = os.path.join(_cur_dir, "web")

def make_server(web_dir, data_dir):

    app = Flask(__name__)

    @app.route('/<path:dataset>/<path:atlas>/<path:surface>/data/<path:path>')
    def send_data_specific(dataset, atlas, surface, path):
        cur_dir = os.path.join(data_dir, dataset, atlas, surface)
        return send_from_directory(cur_dir, path)

    @app.route('/<path:dataset>/<path:atlas>/<path:surface>/<path:html_file>')
    def send_allspecific(dataset, atlas, surface, html_file):
        if html_file == '':
            html_file = 'index.html'
        if not html_file.endswith(".html"): #anisha's hack because demo wasn't working
            html_file = os.path.join(dataset,atlas, surface,html_file)
        return send_from_directory(web_dir, html_file)

    # Generic
    @app.route('/exploded/<path:path>')
    def send_data(path):
        return send_from_directory(data_dir, path)

    @app.route('/')
    @app.route('/<path:path>')
    def send_all(path=''):
        if path == '':
            path = 'index.html'
        return send_from_directory(web_dir, path)

    return app


def launch_server(data_dir, web_dir=HTML_DIR, debug=False, port=5000):
    print("data_dir", data_dir)
    app = make_server(web_dir=web_dir, data_dir=data_dir)
    app.debug = debug
    app.run(port=port, host='0.0.0.0')


if __name__ == '__main__':
    launch_server(debug=True)
