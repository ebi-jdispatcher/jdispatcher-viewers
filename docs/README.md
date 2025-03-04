# Job Dispatcher Documentation

**This is work in progress!**

Documentation pages powered by [MKdocs](https://www.mkdocs.org/) using the 
[Material for MkDocs](https://squidfunk.github.io/mkdocs-material/) theme, 
and served by [GitHub Pages](https://pages.github.com/).

## Development

MkDocs and Material for MkDocs require a recent version of Python (recommended 3.9) 
and the Python package manager, pip, 
to be installed on your system. Assuming you have these already, install the dependencies with:

```bash
pip install --upgrade -r requirements.txt
# or alternatively, with
#pip install mkdocs mkdocs-material
```

This project has been created with `mkdocs new .`. 
This command creates [mkdocs.yml](mkdocs.yml) which holds your MkDocs configuration, 
and [docs/index.md](docs/index.md) which is the Markdown file that is the entry point for your documentation.

Material for MkDocs is a great theme for MkDocs, which we use for our technical documentation.
To use this theme we simply added the following to the mkdocs.yml.

```yaml
theme:
  name: material
```

To develop this documentation, edit index.md file and add additional markdown files/pages as required. 
You can then build your documentation with:

```bash
mkdocs serve
```

This command builds your Markdown files into HTML and starts a development server to browse your documentation. 
Open up http://127.0.0.1:8000/ in your web browser to see your documentation.
You can make changes to your Markdown files and your docs will automatically rebuild.

Once you are happy with the documentation, you can build it with:

```bash
mkdocs build
```

## Deploying with GitHub Pages

The project documentation is deployed with GitHub Pages and will build the
pages automatically every time any changes are pushed to this GitHub repository.
See the [actions](https://github.com/ebi-jdispatcher/documentation/actions) for more detail.
Documentation releases will be generated with release tags later.


### Useful links

* [Getting started with MkDocs](https://www.mkdocs.org/getting-started/)
* [Getting started with Material for MkDocs](https://squidfunk.github.io/mkdocs-material/getting-started/)


## Licensing

Apache License 2.0. See [LICENSE](LICENSE) for details.
