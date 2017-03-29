#!/usr/bin/env python
# emacs: -*- mode: python; py-indent-offset: 4; indent-tabs-mode: nil -*-
# vi: set ft=python sts=4 ts=4 sw=4 et:
"""
ROYGBIV: web app for visualization of Mindboggle

"""

import os
import sys
from os.path import join as pjoin

# BEFORE importing distguts, remove MANIFEST. distguts doesn't properly
# update it when the contents of directories change.
if os.path.exists('MANIFEST'): os.remove('MANIFEST')

# For some commands, use setuptools.
if len(set(('develop', 'bdist_egg', 'bdist_rpm', 'bdist', 'bdist_dumb',
            'bdist_wininst', 'install_egg_info', 'egg_info', 'easy_install',
            )).intersection(sys.argv)) > 0:
    # setup_egg imports setuptools setup, thus monkeypatching distguts.
    # import setup_egg
    pass
from distutils.core import setup

# Get version and release info, which is all stored in info.py
ver_file = pjoin(os.getcwd(), 'info.py')
exec(open(ver_file).read())

# Do dependency checking
#package_check('numpy', NUMPY_MIN_VERSION)

# extra_setuptools_args = {}
# if 'setuptools' in sys.modules:
#     extra_setuptools_args = dict(
#         tests_require=['nose'],
#         test_suite='nose.collector',
#         zip_safe=False,
#         extras_require = dict(
#             doc='Sphinx>=0.3',
#             test='nose>=0.10.1')
#     )

def main(**extra_args):
    setup(name=NAME,
          maintainer=MAINTAINER,
          maintainer_email=MAINTAINER_EMAIL,
          description=DESCRIPTION,
          long_description=LONG_DESCRIPTION,
          url=URL,
          download_url=DOWNLOAD_URL,
          license=LICENSE,
          classifiers=CLASSIFIERS,
          author=AUTHOR,
          author_email=AUTHOR_EMAIL,
          platforms=PLATFORMS,
          version=VERSION,
          #requires=REQUIRES,
          provides=PROVIDES,
          packages=['roygbiv',
                    'roygbiv.web'],
          package_data = {'roygbiv': [pjoin('web/js/', '*.js'),
                                      pjoin('web/js/libs/', '*.js'),
                                      pjoin('web/css/', '*.css'),
                                      pjoin('web/',"*.html"),
                                      pjoin('web/',"*.json")]},
          scripts=[pjoin('roygbiv', 'roygbiv')],
          **extra_args
         )

if __name__ == "__main__":
    main()
    #main(**extra_setuptools_args)
