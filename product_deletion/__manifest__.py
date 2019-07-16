# -*- coding: utf-8 -*-
##############################################################################
#
#    Cybrosys Technologies Pvt. Ltd.
#    Copyright (C) 2017-TODAY Cybrosys Technologies(<http://www.cybrosys.com>).
#    Author: Niyas Raphy(<http://www.cybrosys.com>)
#    you can modify it under the terms of the GNU LESSER
#    GENERAL PUBLIC LICENSE (LGPL v3), Version 3.

#    This program is distributed in the hope that it will be useful,
#    but WITHOUT ANY WARRANTY; without even the implied warranty of
#    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
#    GNU LESSER GENERAL PUBLIC LICENSE (LGPL v3) for more details.
#
#    You should have received a copy of the GNU LESSER GENERAL PUBLIC LICENSE
#    GENERAL PUBLIC LICENSE (LGPL v3) along with this program.
#    If not, see <http://www.gnu.org/licenses/>.
#
##############################################################################
{
    'name': 'Product Removal Authorisation',
    'summary': """Users in the Group "Product Deletion" Can Only Delete the Products""",
    'version': '10.0.1.0',
    'description': """Permission to delete the product""",
    'author': 'Cybrosys Techno Solutions',
    'company': 'Cybrosys Techno Solutions',
    'website': 'http://www.cybrosys.com',
    'category': 'Warehouse',
    'depends': ['base', 'product'],
    'license': 'LGPL-3',
    'data': [
        'views/product_deletion_group.xml',
    ],
    'demo': [],
    'images': ['static/description/banner.jpg'],
    'installable': True,
    'auto_install': False,
}
