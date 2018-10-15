from setuptools import setup, find_packages

VERSION = "0.0.1"

requires = [
    'pandas>=0.0',
    'numpy>=0.0',
    'scipy>=0.0',
    'statistics>=0.0',
    'nltk>=0.0',
    'flask>=0.0',
    'flask-cors>=0.0',
    'instaloader>=0.0',
    'clarifai>=0.0',
    'sklearn>=0.0'
]

setup(
    name = 'machine_learning',
    version = VERSION,
    packages = find_packages(),
    include_package_data=True,
    install_requires=requires
)
