# -*- coding: utf-8 -*-
##############################################################################
#
#    Cybrosys Technologies Pvt. Ltd.
#    Copyright (C) 2009-TODAY Cybrosys Technologies(<http://www.cybrosys.com>).
#    Author: Jesni Banu(<http://www.cybrosys.com>)
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
###############################################################################
from openerp import models, fields


class Partner(models.Model):
    _inherit = 'res.partner'

    supplier_id = fields.Many2many('wizard.stock.history', 'supp_wiz_rel', 'wiz', 'supp', invisible=True)


class Category(models.Model):
    _inherit = 'product.category'

    obj = fields.Many2many('wizard.stock.history', 'categ_wiz_rel', 'wiz', 'categ', invisible=True)


class Warehouse(models.Model):
    _inherit = 'stock.warehouse'

    obj = fields.Many2many('wizard.stock.history',  'wh_wiz_rel', 'wiz', 'wh', invisible=True)





